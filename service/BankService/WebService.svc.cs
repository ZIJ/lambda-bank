using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using BankEntities;
using System.ServiceModel.Channels;

namespace BankService
{
	public class WebService : IBankService
	{
		private static BankDaemon bank = new BankDaemon();
		private static BankDatabase db = null;

		static WebService()
		{
			bank.StartProcessing();
			db = bank.Database;
		}

		public Message Login(string login, string password)
		{
			LoginInfo info = bank.Logon(login, password);

			if (info == null)
			{
				throw new WebFaultException(System.Net.HttpStatusCode.Forbidden);
			}

			var response = new { AuthenticationToken = info.UID, Role = info.User.Role.ToString() };
			return CreateJsonResponse(response);
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
			return CreateJsonResponse(cardsStub);
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

		private static Message CreateJsonResponse(object obj)
		{
			string response = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(obj);
			return WebOperationContext.Current.CreateTextResponse(response, "application/json");
		}

		public Message GetLastPayments(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		#region Users
		public Message GetUsers(Guid securityToken)
		{
			return CreateJsonResponse(bank.Database.BankUsers);
		}

		public Message CreateUser(Guid securityToken, BankUser user)
		{
			db.BankUsers.Add(user);
			db.SaveChanges();
			return CreateJsonResponse(new { Status = "OK", ID = user.ID });
		}

		public Message UpdateUser(Guid securityToken, BankUser user)
		{
			BankUser currentUser = db.BankUsers.Find(user.ID);

			//copy user info
			currentUser.Name = user.Name;
			db.SaveChanges();
			return CreateJsonResponse("OK");
		} 
		#endregion

		#region Cards
		public Message GetCards(Guid securityToken, int userID)
		{
			return CreateJsonResponse(db.BankUsers.Find(userID).Cards);
		}

		public Message CreateCard(Guid securityToken, Card card, int userID)
		{
			db.Cards.Add(card);
			db.BankUsers.Find(userID).Cards.Add(card);
			db.SaveChanges();
			return CreateJsonResponse(new { Status = "OK", CreatedObject = card });
		}
		#endregion

		public Message CreateAccount(Guid securityToken, Account account)
		{
			db.Accounts.Add(account);
			db.SaveChanges();
			return CreateJsonResponse(new { Status = "OK", CreatedObject = account });
		}

		public Message AttachAccount2Card(Guid securityToken, int accountID, int cardID)
		{
			Account acc = db.Accounts.Find(accountID);
			Card card = db.Cards.Find(cardID);

			acc.Cards.Add(card);
			card.Accounts.Add(acc);
			db.SaveChanges();
			return CreateJsonResponse(new { Status = "OK" });
		}
	}
}
