using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;

namespace BankEntities
{
	public class Bank
	{
		private BankDatabase db = null;

		private UserService userService = null;

		private IERIP ERIP = null;

		private Guid thisBankGuid = Guid.NewGuid();

		public Bank()
		{
			BankArbiter.Banks.Add(thisBankGuid, this);
			string connection = null;
			ConnectionStringSettings connectionString = ConfigurationManager.ConnectionStrings["LambdaDB"];
			if (connectionString != null)
			{
				connection = connectionString.ConnectionString;
			}
			else
			{
				System.Data.Entity.Database.SetInitializer(new DefaultInitializer());
				connection = "BankDatabase";
			}

			db = new BankDatabase(connection);

			userService = new UserService(this);

			//FixTransactions();
			//Thread daemon = new Thread(new ThreadStart(StartProcessing));
		}

		public BankDatabase Database
		{
			get
			{
				return db;
			}
		}

		public UserService UserService
		{
			get
			{
				return userService;
			}
		}

		public object GetPaymentInfo(string payment)
		{
			EripPaymentType type = ParsePaymentEripType(payment);
			return ERIP.GetPaymentInfo(type, payment);
		}

		public object GetPrepaymentInfo(BankUser user, string payment)
		{
			int accountId = int.Parse(payment.GetJsonAttribute("accountId"));
			Account account = user.Cards.SelectMany(c => c.Accounts).Where(a => a.ID == accountId).FirstOrDefault();
			if (account != null)
			{
				EripPaymentType type;
				decimal amount;
				ParsePaymentRequest(payment, out type, out amount);
				Prerequisite requisite = ERIP.GetPrerequisites(type);
				var info = new
				{
					AmountCharged = BackConvertCurrency(account.Currency, requisite.Currency, amount),
					ChangeId = UserService.PasswordDistortion(account.Amount.ToString(), "res")
				};
				return info;
			}
			else
			{
				throw new ArgumentNullException();
			}
		}

		public void ProcessPayment(BankUser user, string payment)
		{
			int accountId = int.Parse(payment.GetJsonAttribute("accountId"));
			Account account = user.Cards.SelectMany(c => c.Accounts).Where(a => a.ID == accountId).FirstOrDefault();
			if (account != null)
			{
				string changeid = payment.GetJsonAttribute("changeId");
				if (changeid != UserService.PasswordDistortion(account.Amount.ToString(), "res"))
				{
					throw new ArgumentOutOfRangeException();
				}
				Pay(account, payment);
			}
			else
			{
				throw new ArgumentNullException();
			}
		}

		public void IncomingPay(BankPayment payment)
		{
			Transaction transaction = new Transaction()
			{
				FromAccountNumber = payment.FromAccountNumber,
				FromBank = payment.FromBank,
				ToBank = payment.ToBank,
				ToAccountNumber = payment.ToAccountNumber,
				FromAccountCurrency = payment.Currency,
				FromAccountDelta = payment.Amount
			};
			transaction.State = TransactionState.Opened;
			Account receiver = db.Accounts.Where(a => a.AccountNumber == payment.ToAccountNumber).FirstOrDefault();
			if (receiver == null)
			{
				throw new ArgumentOutOfRangeException("account not found");
			}
			transaction.ToAccountBackupAmount = receiver.Amount;
			transaction.ToAccountCurrency = receiver.Currency;
			transaction.ToAccountDelta = ConvertCurrency(payment.Currency, receiver.Currency, payment.Amount);
			db.Transactions.Add(transaction);
			db.SaveChanges();
			receiver.Amount += transaction.ToAccountDelta;
			transaction.State = TransactionState.Closed;
			db.SaveChanges();
		}

		public int CreateCard(BankUser user, Currency[] currencies, int? accountId)
		{
			Card newCard = new Card();
			if (currencies != null)
			{
				foreach (Currency c in currencies)
				{
					Account newAccount = new Account();
					newAccount.Amount = 0;
					newAccount.Cards.Add(newCard);
					newAccount.Currency = c;
					db.Accounts.Add(newAccount);
					newCard.Accounts.Add(newAccount);
				}
			}
			else if (accountId.HasValue)
			{
				Account existingAccount = user.Cards.SelectMany(c => c.Accounts).Where(a => a.ID == accountId.Value).FirstOrDefault();
				newCard.Accounts.Add(existingAccount);
			}
			else
			{
				throw new ArgumentNullException("Both arguments is null");
			}
			newCard.BankUser = user;
			user.Cards.Add(newCard);
			db.SaveChanges();
			return newCard.ID;
		}

		private void StartProcessing()
		{
			while (true)
			{
				DateTime now = DateTime.Now.Date;

				foreach (Schedule schedule in db.Schedules)
				{
					DateTime nextPay = DateTime.Now;
					bool payNow = false;
					switch (schedule.ScheduleBit)
					{
 						case ScheduleBit.Year:
							nextPay = schedule.LastTime.AddYears(schedule.BitQuantity);
							break;
						case ScheduleBit.Month:
							nextPay = schedule.LastTime.AddMonths(schedule.BitQuantity);
							break;
						case ScheduleBit.Week:
							nextPay = schedule.LastTime.AddDays(7 * schedule.BitQuantity);
							break;
						case ScheduleBit.Day:
							nextPay = schedule.LastTime.AddDays(7 * schedule.BitQuantity);
							break;
					}
					if (nextPay <= now)
					{
						ProcessPayment(schedule.User, schedule.Template.JsonPayment);
						schedule.LastTime = now;
					}
				}
				Thread.Sleep(1000 * 60 * 60);
			}
		}
		
		private void FixTransactions()
		{
			foreach (Transaction t in db.Transactions.Where(i => i.State == TransactionState.Opened))
			{
				RollbackTransaction(t);
			}
		}

		private decimal ConvertCurrency(Currency from, Currency to, decimal amount)
		{
			return amount; //temp;
		}

		private decimal BackConvertCurrency(Currency from, Currency to, decimal converted)
		{
			return converted; //temp;
		}

		private void RollbackTransaction(Transaction t)
		{
			if (t.FromAccountID != null)
			{
				Account acc = db.Accounts.Find(t.FromAccountID);
				acc.Amount = t.FromAccountBackupAmount;
			}
			else
			{
				RollbackOuterAccount(t.FromAccountNumber, t.FromAccountCurrency, t.FromAccountBackupAmount);
			}

			if (t.ToAccountID != null)
			{
				Account acc = db.Accounts.Find(t.ToAccountID);
				acc.Amount = t.ToAccountBackupAmount;
			}
			else
			{
				RollbackOuterAccount(t.ToAccountNumber, t.ToAccountCurrency, t.ToAccountBackupAmount);
			}
		}

		private void RollbackOuterAccount(string accountNumber, Currency currency, decimal value)
		{

		}

		private void Pay(Account account, string jsonPayment)
		{
			Transaction t = null;
			try
			{
				EripPaymentType type;
				decimal amount;
				ParsePaymentRequest(jsonPayment, out type, out amount);

				Prerequisite requisite = ERIP.GetPrerequisites(type);
				bool internalTransaction = requisite.BankGuid == thisBankGuid;
				Account receiver = null;
				t = new Transaction();
				t.FromAccountBackupAmount = account.Amount;
				t.FromAccountNumber = account.AccountNumber;
				t.FromBank = thisBankGuid;
				t.FromAccountID = account.ID;
				t.FromAccountDelta = BackConvertCurrency(account.Currency, requisite.Currency, amount);
				t.FromAccountCurrency = account.Currency;

				t.ToBank = requisite.BankGuid;
				t.ToAccountNumber = requisite.AccountNumber;

				if (internalTransaction)
				{
					receiver = db.Accounts.Where(a => a.AccountNumber == requisite.AccountNumber).FirstOrDefault();
					if (receiver == null)
					{
						throw new ArgumentOutOfRangeException("receive account was not found");
					}
					t.ToAccountID = receiver.ID;
					t.ToAccountBackupAmount = receiver.Amount;
					t.ToAccountCurrency = receiver.Currency;
					t.ToAccountDelta = -ConvertCurrency(requisite.Currency, receiver.Currency, t.FromAccountDelta);
				}
				else
				{
					t.ToAccountCurrency = requisite.Currency;
				}
				t.State = TransactionState.Opened;
				db.Transactions.Add(t);
				db.SaveChanges();


				if (internalTransaction)
				{
					account.Amount += t.FromAccountDelta;
					receiver.Amount += t.ToAccountDelta;
				}
				else
				{
					BankPayment bp = new BankPayment();
					bp.Amount = amount;
					bp.FromBank = thisBankGuid;
					bp.ToBank = requisite.BankGuid;
					bp.FromAccountNumber = account.AccountNumber;
					bp.ToAccountNumber = requisite.AccountNumber;
					bp.Currency = requisite.Currency;
					BankArbiter.Transact(bp);
				}
				t.State = TransactionState.Closed;
				db.SaveChanges();
				ERIP.SendPayment(type, jsonPayment);
			}
			catch 
			{
				if (t != null && t.ID != 0)
				{
					RollbackTransaction(t);
					db.SaveChanges();
				}
			}
		}
		
		private static void ParsePaymentRequest(string json, out EripPaymentType type, out decimal amount)
		{
			type = (EripPaymentType)Enum.Parse(typeof(EripPaymentType), json.GetJsonAttribute("type"), true);
			amount = decimal.Parse(json.GetJsonAttribute("amount"));
		}

		private static EripPaymentType ParsePaymentEripType(string json)
		{
			return (EripPaymentType)Enum.Parse(typeof(EripPaymentType), json.GetJsonAttribute("type"), true);
		}
	}

	class DefaultInitializer : System.Data.Entity.DropCreateDatabaseAlways<BankDatabase>// DropCreateDatabaseIfModelChanges<BankDatabase>
	{
		protected override void Seed(BankDatabase context)
		{
			context.Roles.Add(new Role() { Name = "user" });
			context.Roles.Add(new Role() { Name = "operator" });
			context.Roles.Add(new Role() { Name = "admin" });
			context.SaveChanges();

			CardClass cardClass = new CardClass()
			{
				Name = "Visa"
			};
			CardType cardType = new CardType() { Name = "Electron", Class = cardClass };
			cardClass.Types.Add(cardType);
			cardClass.Types.Add(new CardType() { Name = "Classic", Class = cardClass });
			cardClass.Types.Add(new CardType() { Name = "Gold", Class = cardClass });
			cardClass.Types.Add(new CardType() { Name = "Black Card", Class = cardClass });
			cardClass.Types.FirstOrDefault(t => { context.CardTypes.Add(t); return false; });

			context.CardClasses.Add(cardClass);
			context.CardClasses.Add(new CardClass { Name = "Master Card" });

			context.SaveChanges();

			InternetBankingUser admin = new InternetBankingUser();
			admin.Login = "root";
			admin.Salt = Guid.NewGuid().ToString("N");
			admin.PasswordHash = UserService.PasswordDistortion("root", admin.Salt);
			admin.Role = context.Roles.FirstOrDefault((r) => r.Name == "Admin");
			context.InternetBankingUsers.Add(admin);

			context.SaveChanges();

			BankUser user = new BankUser();
			user.FirstName = "Charles";
			user.LastName = "Jr.";
			user.PassportNumber = "A01245854B465C2333";
			user.Address = "here";
			Account account = new Account();
			Card card = new Card();
			user.Cards.Add(card);
			card.BankUser = user;
			card.Accounts.Add(account);
			account.Cards.Add(card);
			card.CVV = "234";
			card.ExpirationDate = DateTime.Now + TimeSpan.FromDays(365);
			card.Type = cardType;
			account.Currency = Currency.BYR;
			account.Amount = 10000000;

			context.Accounts.Add(account);
			context.Cards.Add(card);
			context.BankUsers.Add(user);
			context.SaveChanges();
		}
	}
}
