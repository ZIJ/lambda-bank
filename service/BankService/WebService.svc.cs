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
using BankSystem;

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

		#region Login

		public Message Login(string login, string password)
		{
			LoginInfo info = bank.UserService.Logon(login, password);

			if (info == null)
			{
				throw new WebFaultException((HttpStatusCode)477);
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

		public Message VerifyToken(Guid securityToken)
		{
			LoginInfo info = bank.UserService.GetUser(securityToken, false);
			if (info == null)
			{
				throw new WebFaultException((HttpStatusCode)477);
			}

			int secondsLeft = (int)info.TimeLeft.TotalSeconds;

			var response = new
			{
				Role = info.User.Role.Name,
				SecondsLeft = secondsLeft,
				AuthenticationToken = info.UID,
				UserInfo = info.User.BankUser == null ? null :
				new
				{
					Id = info.User.BankUser.ID,
					FirstName = info.User.BankUser.FirstName,
					LastName = info.User.BankUser.LastName
				}
			};

			return Json(response);
		}

		public Message Logout(Guid securityToken)
		{
			bank.UserService.Logout(securityToken);
			return Json("OK");
		}

		private BankUser GetUser(Guid securityToken)
		{
			LoginInfo info = bank.UserService.GetUser(securityToken);
			if (info == null)
			{
				throw new WebFaultException((HttpStatusCode)477);
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
				throw new WebFaultException((HttpStatusCode)477);
			}
			else if (info.User.Role.ToString() != "admin")
			{
				throw new WebFaultException(HttpStatusCode.Forbidden);
			}
			return info;
		}

		#endregion

		public Message GetUserCards(Guid securityToken)
		{
			BankUser info = GetUser(securityToken);
			return Json(info.Cards.Select(c => CreateCardResponse(c, false)));
		}

		public Message CreateCard(Guid securityToken, int userId, int typeId, DateTime expirationTime, Currency[] currency, int? accountID2Attach)
		{
			GetAdmin(securityToken);
			BankUser user = db.BankUsers.Find(userId);
			if (user == null)
			{
				throw new WebFaultException<string>("User was not found", HttpStatusCode.NotFound);
			}

			CardType type = db.CardTypes.Find(typeId);

			if (user == null)
			{
				throw new WebFaultException<string>("CardType was not found", HttpStatusCode.NotFound);
			}

			int id = bank.CreateCard(user, type, currency, accountID2Attach, expirationTime);
			return Json(new { ID = id });
		}

		public Message GetLog(Guid securityToken, int cardId, DateTime start, DateTime end)
		{
			BankUser user = GetUser(securityToken);
			Card card = db.Cards.Find(cardId);
			if (card.BankUser != user)
			{
				throw new WebFaultException(HttpStatusCode.Forbidden);
			}
			SortedList<DateTime, TransactionLog> sorted = new SortedList<DateTime, TransactionLog>();
			foreach (Account account in card.Accounts)
			{
				foreach (TransactionLog log in bank.GetLog(account, start, end))
				{
					sorted.Add(log.Time, log);
				}
			}
			return Json(sorted.Values);
		}

		#region Payment

		public Message PaymentAccountDetails(Guid securityToken, PaymentRequisites requisite)
		{
			GetUser(securityToken);
			return Json(bank.GetPaymentInfo(requisite.Type, requisite.JsonPayment));
		}

		public Message PaymentPreInfo(Guid securityToken, PaymentRequisites requisite)
		{
			BankUser user = GetUser(securityToken);
			return Json(bank.GetPrepaymentInfo(user, requisite.AccountId, requisite.Amount, requisite.Type, requisite.JsonPayment));
		}

		public Message PaymentProceed(Guid securityToken, PaymentRequisites requisite)
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
		}

		public Message TransferAccountDetails(Guid securityToken, TransferRequisite requisite)
		{
			BankUser user = GetUser(securityToken);
			Account account = GetReceiverAccount(requisite);
			if (account == null)
			{
				throw new WebFaultException<string>("Receiver account was not found", HttpStatusCode.NotFound);
			}
			return Json(new
			{
				Status = "Valid"
			});
		}

		public Message TransferPreInfo(Guid securityToken, TransferRequisite requisite)
		{
			BankUser user = GetUser(securityToken);
			Account receiver = GetReceiverAccount(requisite);
			if (receiver == null)
			{
				throw new WebFaultException<string>("Receiver account was not found", HttpStatusCode.NotFound);
			}

			Account sender = db.Accounts.Find(requisite.FromAccountId);
			if (sender == null || !user.OwnsAccount(sender))
			{
				throw new WebFaultException<string>("Sender account was not found", HttpStatusCode.NotFound);
			}

			decimal amountCharged = bank.BackConvertCurrency(sender.Currency, requisite.Currency, requisite.Amount);

			var info = new
			{
				AmountCharged = amountCharged,
				ChangeId = UserService.PasswordDistortion(receiver.Amount.ToString(), "res"),
				EnoughMoney = amountCharged >= receiver.Amount
			};

			return Json(info);
		}

		public Message TransferProceed(Guid securityToken, TransferRequisite requisite)
		{
			BankUser user = GetUser(securityToken);
			Account receiver = GetReceiverAccount(requisite);
			if (receiver == null)
			{
				throw new WebFaultException<string>("Receiver account was not found", HttpStatusCode.NotFound);
			}

			Account sender = db.Accounts.Find(requisite.FromAccountId);
			if (sender == null || !user.OwnsAccount(sender))
			{
				throw new WebFaultException<string>("Sender account was not found", HttpStatusCode.NotFound);
			}
			return Json(bank.TransferMoney(user, sender, receiver, requisite.Currency, requisite.Amount));
		}

		private Account GetReceiverAccount(TransferRequisite requisite)
		{
			if (requisite.ToAccountId != null)
			{
				return db.Accounts.Find(requisite.ToAccountId.Value);
			}
			else
			{
				return db.FindAccount(requisite.ToAccountNumber);
			}
		}

		#endregion

		private static Message Json(object obj)
		{
			string response = serializer.Serialize(new { Response = obj });
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
			if (db.BankUsers.ToList().Any(u => u.PassportNumber.Equals(user.PassportNumber, StringComparison.InvariantCultureIgnoreCase)))
			{
				return Json(new { Status = "PassportAlreadyExist"});
			}
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

		public Message FreezeCards(Guid securityToken, int[] cardsIds)
		{
			return SetFreezeAttribute(securityToken, cardsIds, true);
		}

		public Message UnfreezeCards(Guid securityToken, int[] cardsIds)
		{
			return SetFreezeAttribute(securityToken, cardsIds, false);
		}

		public Message SetFreezeAttribute(Guid securityToken, int[] cardsIds, bool freeze)
		{
			GetAdmin(securityToken);
			foreach (int id in cardsIds)
			{
				Card card = db.Cards.Find(id);
				if (card != null)
				{
					card.FreezeDate = freeze ? DateTime.Now : (DateTime?)null;
				}
			}
			return Json("OK");
		}

		#endregion

		#region Accounts

		public Message GetAccounts(Guid securityToken, int? accountId, int? userId)
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
			if (userId != null)
			{
				return Json(db.Accounts.Where(a => a.Owner == null ? false : a.Owner.ID == userId).ToList().Select(a => CreateAccountResponse(a)));
			}
			return Json(db.Accounts.ToList().Select(a => CreateAccountResponse(a)));
		}


		public Message ReplenishAccount(Guid securityToken, int id, decimal amount)
		{
			GetAdmin(securityToken);
			Account account = db.Accounts.Find(id);
			if (account == null)
			{
				throw new WebFaultException<string>("Account was not found", HttpStatusCode.NotFound);
			}
			bank.ReplenishAccount(account, amount);
			return Json(new { Status = "OK" });
		}

		public Message WithdrawAccount(Guid securityToken, int id, decimal amount)
		{
			GetAdmin(securityToken);
			Account account = db.Accounts.Find(id);
			if (account == null)
			{
				throw new WebFaultException<string>("Account was not found", HttpStatusCode.NotFound);
			}
			if (account.Amount < amount)
			{
				return Json(new { Status = "NotEnoughMoney" });
			}
			bank.WithdrawAccount(account, amount);
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
				Holder = card.Holder,
				ExpirationDate = card.ExpirationDate,
				CardState = card.State.ToString(),
				FreezeDate = card.FreezeDate,
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
				Currency = acc.Currency.ToString(),
				Description = acc.Description,
				acc.Amount,
			};
			return response;
		}

		#region SavedPayment

		public Message SavePayment(Guid securityToken, PaymentRequisites payment)
		{
			BankUser user = GetUser(securityToken);
			PaymentTemplate template = TraverseTemplate(payment);
			template.Owner = user;
			template.Type = TemplateType.Saved;
			
			db.PaymentTemplates.Add(template);
			db.SaveChanges();

			return Json(TraverseTemplate(template));
		}

		public PaymentTemplate TraverseTemplate(PaymentRequisites requisites)
		{
			PaymentTemplate template = new PaymentTemplate();
			Account account = db.Accounts.Find(requisites.AccountId);
			if (account == null)
			{
				throw new WebFaultException(HttpStatusCode.NotFound);
			}
			template.Account = account;
			template.Amount = requisites.Amount;
			template.JsonPayment = requisites.JsonPayment;
			template.EripType = requisites.Type;
			return template;
		}

		public PaymentRequisites TraverseTemplate(PaymentTemplate template)
		{
			PaymentRequisites requisite = new PaymentRequisites();
			requisite.ID = template.ID;
			requisite.AccountId = template.Account.ID;
			requisite.Amount = template.Amount;
			requisite.JsonPayment = template.JsonPayment;
			requisite.Type = template.EripType;
			return requisite;
		}

		public Message GetSavedPayments(Guid securityToken)
		{
			BankUser user = GetUser(securityToken);
			return Json(user.SavedPayments.ToArray().Select(p => TraverseTemplate(p)));
		}

		public Message DeleteSavedPayment(Guid securityToken, int id)
		{
			BankUser user = GetUser(securityToken);
			PaymentTemplate payment = user.SavedPayments.Where(p => p.ID == id).FirstOrDefault();
			db.PaymentTemplates.Remove(payment);
			db.SaveChanges();
			return Json(new { Status = "OK" });
		}

		#endregion SavedPayment

		#region Schedule

		public Message GetSchedules(Guid securityToken)
		{
			BankUser user = GetUser(securityToken);
			return Json(user.Schedules);
		}

		public Message CreateSchedule(Guid securityToken, Schedule schedule, PaymentRequisites requisite)
		{
			BankUser user = GetUser(securityToken);
			PaymentTemplate template = TraverseTemplate(requisite);
			template.Owner = user;
			template.Type = TemplateType.Scheduled;
			db.PaymentTemplates.Add(template);

			schedule.Template = template;
			schedule.User = user;
			user.Schedules.Add(schedule);
			db.Schedules.Add(schedule);
			db.SaveChanges();

			return Json(new 
			{
				MerryChristmas = "Merry Christmas",
				Status = "OK",
				ID = schedule.ID,
			});
		}

		public Message DeleteSchedule(Guid securityToken, int id)
		{
			BankUser user = GetUser(securityToken);
			Schedule schedule = db.Schedules.Find(id);
			if (schedule.User != user)
			{
				throw new WebFaultException(HttpStatusCode.Forbidden);
			}
			db.Schedules.Remove(schedule);
			db.SaveChanges();
			return Json(new
			{
				Status = "OK",
			});
		}

		#endregion

		public Message GetCurrencies()
		{
			return Json(CreateEnumDescription(typeof(Currency)));
		}

		private object CreateEnumDescription(Type enumType)
		{
			int[] values = Enum.GetValues(enumType).Cast<int>().ToArray();
			string[] names = Enum.GetNames(enumType);
			List<object> result = new List<object>();
			for (int i = 0; i < values.Length; i++)
			{
				result.Add(new { Id = values[i], Name = names[i] });
			}
			return result;
		}

		public Message GetCardTypes()
		{
			List<object> result = new List<object>();
			foreach (CardType type in db.CardTypes)
			{
				result.Add(
					new 
					{
						Id = type.ID,
						Name = type.ToString(),
					}
				);
			}
			return Json(result);
		}

		public Message CreateAdmin(Guid securityToken)
		{
			throw new NotImplementedException();
		}

		public Message CreateOperator(Guid securityToken)
		{
			throw new NotImplementedException();
		}



		
	}
}
