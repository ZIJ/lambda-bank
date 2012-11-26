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

		private Guid thisBankGuid;

		public Bank()
		{
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

		public void StartProcessing()
		{
			while (true)
			{
				DateTime now = DateTime.Now;
				foreach (CalendarSchedule schedule in db.CalendarSchelules)
				{
					if ((schedule.DayOfMonth == null || schedule.DayOfMonth == now.Day) &&
						(schedule.DayOfWeek == null || schedule.DayOfWeek % 7 == (int)now.DayOfWeek) &&
						(schedule.Hour == null || schedule.Hour == now.Hour) &&
						(schedule.Month == null || schedule.Month == now.Month)
						)
					{
						//run
					}
				}
				foreach (SpanSchedule schedule in db.SpanSchedules)
				{
					TimeSpan span = DateTime.Now - schedule.LastTime;
					int repeatCount = (int)Math.Floor(span.TotalMinutes / schedule.Span.TotalMinutes);
					for (int i = 0; i < repeatCount; i++)
					{
						//run
						schedule.LastTime += schedule.Span;
					}
				}
				Thread.Sleep(1000 * 60 * 60);
			}
		}

		public void FixTransactions()
		{
			foreach (Transaction t in db.Transactions.Where(i => i.State == TransactionState.Opened))
			{
				RollbackTransaction(t);
			}
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

		private void RollbackOuterAccount(byte[] accountNumber, Currency currency, decimal value)
		{

		}

		private void Pay(ERIPPaymentType type, string jsonPayment)
		{
			ERIP.SendPayment(type, jsonPayment);
		}

		private void SendMoney()
		{
			
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
			account.AccountNumber = "1234567890123";
			card.CardNumber = "1234567890123456";
			card.CVV = 145;
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
