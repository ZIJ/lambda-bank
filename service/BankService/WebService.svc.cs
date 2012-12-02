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

			var response = new { AuthenticationToken = info.UID, Role = info.User.Role.ToString() };
			return Json(response);
		}


		public Message GetUserCards(Guid securityToken)
		{
			List<object> cardsStub = new List<object>();

			List<object> accountsStub = new List<object>();


			var acc = new { AccNumber = new byte[] { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 9, 4 }, Amount = "100", Currency = Currency.USD };
			accountsStub.Add(acc);
			accountsStub.Add(acc);

			var card = new { Accounts = accountsStub.ToArray(), CardNumber = new byte[] { 1, 2, 5, 7, 8, 9, 0, 0, 1 } };
			cardsStub.Add(card);
			cardsStub.Add(card);
			return Json(cardsStub);
		}

		public Message GetLog(Guid securityToken, byte[] accountNumber, DateTime start, DateTime end)
		{
			throw new NotImplementedException();
		}

		public Message PayAccDetails(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message PrePaymentInfo(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
		}

		public Message Payment(Guid securityToken, string paymentInfo)
		{
			throw new NotImplementedException();
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
			LoginInfo info = GetUser(securityToken);
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
		public Message GetCards(Guid securityToken, int userID)
		{
			return Json(db.BankUsers.Find(userID).Cards);
		}

		public Message CreateCard(Guid securityToken, Card card, int userID)
		{
			db.Cards.Add(card);
			db.BankUsers.Find(userID).Cards.Add(card);
			db.SaveChanges();
			return Json(new { Status = "OK", CreatedObject = card });
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

		private LoginInfo GetUser(Guid securityToken)
		{
			LoginInfo info = bank.UserService.GetUser(securityToken);
			if (info == null)
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
			}
			return info;
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


		public Message CreateCard(Guid securityToken, int typeID, Currency? currency, int? accountID2Attach)
		{
			throw new NotImplementedException();
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


		public Message CreateCard(Guid securityToken, Currency[] currency, int? accountID2Attach)
		{
			throw new NotImplementedException();
		}

		public Message Logout(Guid securityToken)
		{
			bank.UserService.Logout(securityToken);
			return Json("OK");
		}
	}
}
