using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using BankEntities;
using System.ServiceModel.Channels;
using System.Dynamic;
using System.Net;

namespace BankService
{
	public class WebService : IBankService
	{
		private static Bank bank = new Bank();

		private static BankDatabase db = null;

		private static System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

		static WebService()
		{
			db = bank.Database;
		}

		public Message Login(string login, string password)
		{
			LoginInfo info = bank.UserService.Logon(login, password);

			if (info == null)
			{
				throw new WebFaultException(System.Net.HttpStatusCode.Unauthorized);
			}

			string role = info.User.Role.ToString();
			BankUser user = info.User.BankUser;
			var response = new
			{
				AuthenticationToken = info.UID,
				Role = role,
				UserInfo = info.User.BankUser == null? null:
				new 
				{
					Id = user.ID,
					FirstName = user.FirstName,
					LastName = user.LastName
				}
			};
			return Json(response);
		}

		public Message GetUserCards(Guid securityToken)
		{
			BankUser info = GetUser(securityToken);
			return Json(info.Cards.Select(c => CreateCardResponse(c, false)));
		}

		public Message GetLog(Guid securityToken, int cardId, DateTime start, DateTime end)
		{
			throw new NotImplementedException();
		}

		public Message PayAccDetails(Guid securityToken, PaymentRequisites requisite)
		{
			GetUser(securityToken);
			return Json(bank.GetPaymentInfo(requisite.Type, requisite.JsonPayment));
		}

		public Message PrePaymentInfo(Guid securityToken, PaymentRequisites requisite)
		{
			BankUser user = GetUser(securityToken);
			return Json(bank.GetPrepaymentInfo(user, requisite.AccountId, requisite.Amount, requisite.Type, requisite.JsonPayment));
		}

		public Message Payment(Guid securityToken, PaymentRequisites requisite)
		{
			try
			{
				BankUser user = GetUser(securityToken);
				return Json(bank.ProcessPayment(user, requisite.AccountId, requisite.Amount, requisite.Type, requisite.ChangeId, requisite.JsonPayment));
			}
			catch (ArgumentOutOfRangeException)
			{
				throw new WebFaultException(HttpStatusCode.Conflict);
			}
			catch
			{
				throw new WebFaultException(HttpStatusCode.BadRequest);
			}
			return Json("OK");
		}

		public Message GetSavedPayments(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		public Message GetSchedules(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		private static Message Json(object obj)
		{
			string response = serializer.Serialize(new { Response = obj });
			//WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Origin", "*");
			return WebOperationContext.Current.CreateTextResponse(response, "application/json");
		}

		public Message GetLastPayments(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		#region Users
		public Message GetUsers(Guid securityToken, bool joinCards, int? userId)
		{
			LoginInfo info = GetAdmin(securityToken);
			if (userId != null)
			{
				BankUser user = db.BankUsers.Find(userId.Value);
				if (user == null)
				{
					throw new WebFaultException(HttpStatusCode.NotFound);
				}
				return Json(CreateUserResponse(user, joinCards));
			}
			else
			{
				List<object> users = new List<object>();
				foreach (BankUser u in bank.Database.BankUsers)
				{
					users.Add(CreateUserResponse(u, joinCards));
				}
				return Json(users);
			}
		}

		public Message CreateUser(Guid securityToken, BankUser user)
		{
			db.BankUsers.Add(user);
			db.SaveChanges();
			return Json(new { Status = "OK", ID = user.ID });
		}

		public Message UpdateUser(Guid securityToken, BankUser user)
		{
			BankUser currentUser = db.BankUsers.Find(user.ID);

			//copy user info
			currentUser.FirstName = user.FirstName;
			currentUser.LastName = user.LastName;
			currentUser.PassportNumber = user.PassportNumber;
			currentUser.Address = user.Address;

			db.SaveChanges();
			return Json("OK");
		}

		public Message AddIBUser(Guid securityToken, int id)
		{
			BankUser currentUser = db.BankUsers.Find(id);
			if (currentUser == null)
			{
				throw new WebFaultException(HttpStatusCode.NotFound);
			}

			string login;
			string password;
			bank.UserService.GenerateInternetBankingUser(currentUser, out login, out password);

			var response = new
			{
				Login = login,
				Password = password
			};

			return Json(response);
		}

		#endregion

		#region Cards
		public Message GetCards(Guid securityToken, int? userId, int? cardId)
		{
			GetAdmin(securityToken);
			if (cardId != null)
			{
				Card card = db.Cards.Find(cardId.Value);
				if (card == null)
				{
					throw new WebFaultException(HttpStatusCode.NotFound);
				}
				return Json(CreateCardResponse(card, false));
			}
			if (userId != null)
			{
				BankUser user = db.BankUsers.Find(userId.Value);
				if (user == null)
				{
					throw new WebFaultException(HttpStatusCode.NotFound);
				}
				return Json(user.Cards.Select(c => CreateCardResponse(c, false)));
			}
			return Json(db.Cards.ToList().Select(c => CreateCardResponse(c, true)));
		}

		#endregion

		#region Accounts

		public Message GetAccounts(Guid securityToken, int? accountId)
		{
			GetAdmin(securityToken);
			if (accountId != null)
			{
				Account account = db.Accounts.Find(accountId.Value);
				if (account == null)
				{
					throw new WebFaultException(HttpStatusCode.NotFound);
				}
				return Json(CreateAccountResponse(account));
			}
			return Json(db.Accounts.ToList().Select(a => CreateAccountResponse(a)));
		}


		#endregion

		private object CreateUserResponse(BankUser user, bool joinCards)
		{
			var response = new
			{
				ID = user.ID,
				FirstName = user.FirstName,
				LastName = user.LastName,
				PassportNumber = user.PassportNumber,
				Address = user.Address,
				Cards = joinCards ? user.Cards.Select(c => CreateCardResponse(c, false)) : user.Cards.Select(c => (object)c.ID)
			};
			return response;
		}

		private object CreateCardResponse(Card card, bool joinUser)
		{
			var response = new
			{
				ID = card.ID,
				Number = card.CardNumber,
				Type = card.Type.ToString(),
				Holder = card.Holder,
				ExpirationDate = card.ExpirationDate,
				Accounts =  card.Accounts.Select( a => CreateAccountResponse(a)),
				User = joinUser? CreateUserResponse(card.BankUser, false) : (object)card.BankUser.ID
			};
			return response;
		}

		private object CreateAccountResponse(Account acc)
		{
			var response = new
			{
				acc.ID,
				acc.AccountNumber,
				Cards = acc.Cards.Select(c => c.ID),
				acc.Currency,
				acc.Amount,
			};
			return response;
		}

		private BankUser GetUser(Guid securityToken)
		{
			LoginInfo info = bank.UserService.GetUser(securityToken);
			if (info == null)
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
			}
			else if (info.User.Role.ToString() != "user")
			{
				throw new WebFaultException(HttpStatusCode.Forbidden);
			}
			return info.User.BankUser;
		}

		private LoginInfo GetAdmin(Guid securityToken)
		{
			LoginInfo info = bank.UserService.GetUser(securityToken);
			if (info == null)
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
			}
			else if (info.User.Role.ToString() != "admin")
			{
				throw new WebFaultException(HttpStatusCode.Forbidden);
			}
			return info;
		}

		public Message VerifyToken(Guid securityToken)
		{
			LoginInfo info = bank.UserService.GetUser(securityToken, false);
			if (info == null)
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
			}

			int secondsLeft = (int)info.TimeLeft.TotalSeconds;

			var response = new
			{
				Role = info.User.Role.Name,
				SecondsLeft = secondsLeft,
				AuthenticationToken = info.UID
			};

			return Json(response);
		}

		public Message CreateCard(Guid securityToken, int userId, DateTime expirationTime, Currency[] currency, int? accountID2Attach)
		{
			GetAdmin(securityToken); 
			BankUser user = db.BankUsers.Find(userId);
			if (user == null)
			{
				throw new WebFaultException(HttpStatusCode.BadRequest);
			}
			int id = bank.CreateCard(user, currency, accountID2Attach);
			return Json(new { ID = id });
		}

		public Message Logout(Guid securityToken)
		{
			bank.UserService.Logout(securityToken);
			return Json("OK");
		}

		public Message SavePayment(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message CreateSchedule(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message UpdateSchedule(Guid securityToken, int id, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message DeleteSchedule(Guid securityToken, int id)
		{
			throw new NotImplementedException();
		}
	}
}
