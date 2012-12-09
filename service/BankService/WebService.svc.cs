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
			//bank.StartProcessing();
			db = bank.Database;
		}

		public Message Login(string login, string password)
		{
			LoginInfo info = bank.UserService.Logon(login, password);

			if (info == null)
			{
				throw new WebFaultException(System.Net.HttpStatusCode.Forbidden);
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

		public Message GetLog(Guid securityToken, byte[] accountNumber, DateTime start, DateTime end)
		{
			throw new NotImplementedException();
		}

		public Message PayAccDetails(Guid securityToken, string paymentInfo)
		{
			GetUser(securityToken);
			return Json(bank.GetPaymentInfo(paymentInfo));
		}

		public Message PrePaymentInfo(Guid securityToken, string paymentInfo)
		{
			BankUser user = GetUser(securityToken);
			return Json(bank.GetPrepaymentInfo(user, paymentInfo));
		}

		public Message Payment(Guid securityToken, string paymentInfo)
		{
			try
			{
				BankUser user = GetUser(securityToken);
				bank.ProcessPayment(user, paymentInfo);
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

		public Message SavePayments(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message GetSchedules(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		public Message CreateCalendarSchedule(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message UpdateCalendarSchedule(Guid securityToken, int id, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message DeleteCalendarSchedule(Guid securityToken, int id)
		{
			throw new NotImplementedException();
		}

		public Message CreateSpanSchedule(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message UpdateSpanSchedule(Guid securityToken, int id, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message DeleteSpanSchedule(Guid securityToken, int id)
		{
			throw new NotImplementedException();
		}

		private static Message Json(object obj)
		{
			string response = serializer.Serialize(new { Response = obj });
			WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Origin", "*");
			return WebOperationContext.Current.CreateTextResponse(response, "application/json");
		}

		public Message GetLastPayments(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		#region Users
		public Message GetUsers(Guid securityToken, bool joinCards)
		{
			LoginInfo info = GetAdmin(securityToken);
			List<object> users = new List<object>();
			foreach (BankUser u in bank.Database.BankUsers)
			{
				users.Add(CreateUserResponse(u, joinCards));
			}
			return Json(users);
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
		public Message GetCards(Guid securityToken, int userId)
		{
			return Json(db.BankUsers.Find(userId).Cards);
		}

		#endregion

		#region Accounts

		public Message CreateAccount(Guid securityToken, Account account)
		{
			db.Accounts.Add(account);
			db.SaveChanges();
			return Json(new { Status = "OK", CreatedObject = account });
		}

		public Message AttachAccount2Card(Guid securityToken, int accountID, int cardID)
		{
			Account acc = db.Accounts.Find(accountID);
			Card card = db.Cards.Find(cardID);

			acc.Cards.Add(card);
			card.Accounts.Add(acc);
			db.SaveChanges();
			return Json(new { Status = "OK" });
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
				User = joinUser? card.BankUser : (object)card.BankUser.ID
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
			if (info == null || info.User.Role.ToString() != "user")
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
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
	}
}
