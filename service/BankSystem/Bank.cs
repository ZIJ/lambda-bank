using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using BankEntities;

namespace BankSystem
{
	public class Bank
	{
		private BankDatabase db = null;

		private UserService userService = null;

		private IERIP ERIP = new EripImplementers.EripImlemetation();

		private Guid thisBankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}");

		private Dictionary<Currency, decimal> currencyRates = null;

		public Bank()
		{
			//BankArbiter.Banks.Add(thisBankGuid, this);
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

		public Dictionary<Currency, decimal> Currencies
		{
			get
			{
				if (currencyRates == null)
				{
					LoadCurrencies();
				}
				return currencyRates;
			}
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

		public object GetPaymentInfo(EripPaymentType type, string payment)
		{
			return ERIP.GetPaymentInfo(type, payment);
		}

		public void LoadCurrencies()
		{
			Dictionary<Currency, decimal> newRates = new Dictionary<Currency, decimal>();
			Dictionary<string, decimal> rates = ExRatesBy.NbRates.GetCurrencies();
			foreach (KeyValuePair<string, decimal> kvp in rates)
			{
				Currency currency;
				if (Enum.TryParse(kvp.Key, out currency))
				{
					newRates.Add(currency, kvp.Value);
				}
			}
			newRates.Add(Currency.BYR, 1);
			currencyRates = newRates;
		}

		public object GetPrepaymentInfo(BankUser user, int accountId, decimal amount, EripPaymentType type, string payment)
		{
			Account account = user.Cards.SelectMany(c => c.Accounts).Where(a => a.ID == accountId).FirstOrDefault();
			if (account != null)
			{
				Prerequisite requisite = ERIP.GetPrerequisites(type);
				decimal amountCharged = BackConvertCurrency(account.Currency, requisite.Currency, amount);

				var info = new
				{
					AmountCharged = amountCharged,
					ChangeId = UserService.PasswordDistortion(account.Amount.ToString(), "res"),
					EnoughMoney = amountCharged <= account.Amount
				};
				return info;
			}
			else
			{
				throw new ArgumentNullException();
			}
		}

		public object ProcessPayment(BankUser user, int accountId, decimal amount, EripPaymentType type, string changeId, string payment)
		{
			Account account = user.Cards.SelectMany(c => c.Accounts).Where(a => a.ID == accountId).FirstOrDefault();
			PaymentTemplate template = new PaymentTemplate();
			template.Owner = user;
			template.Account = account;
			template.Amount = amount;
			template.EripType = type;
			template.JsonPayment = payment;
			if (account != null)
			{
				lock (this)
				{
					Prerequisite requisite = ERIP.GetPrerequisites(type);
					decimal amountCharged = BackConvertCurrency(account.Currency, requisite.Currency, amount);

					if (changeId != null && changeId != UserService.PasswordDistortion(account.Amount.ToString(), "res"))
					{
						return new
						{
							Status = "AccountChanged",
							AmountCharged = amount,
							ChangeId = UserService.PasswordDistortion(account.Amount.ToString(), "res"),
							EnoughMoney = true
						};
					}
					if (amountCharged > account.Amount)
					{
						return new
						{
							Status = "NotEnoughMoney",
							AmountCharged = amount,
							ChangeId = UserService.PasswordDistortion(account.Amount.ToString(), "res"),
							EnoughMoney = false
						};
					}
					Pay(template);
					return new
					{
						Status = "AccountCharged",
						AmountCharged = amount,
					};
				}
			}
			else
			{
				throw new ArgumentNullException();
			}
		}

		public object TransferMoney(BankUser user, Account sender, Account receiver, Currency currency, decimal amount)
		{
			Transaction t = null;
			try
			{
				t = new Transaction();
				Transact(t, sender, receiver, currency, amount);
				db.SaveChanges();
			}
			catch
			{
				if (t != null && t.ID != 0)
				{
					RollbackTransaction(t);
					db.SaveChanges();
				}
			}
			return null;
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
		
		public int CreateCard(BankUser user, CardType type, IEnumerable<Currency> currencies, int? accountId, DateTime expirationDate)
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
					newAccount.Owner = user;
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
			newCard.Holder = user.FirstName.ToUpper() + " " + user.LastName.ToUpper();
			newCard.ExpirationDate = expirationDate;
			newCard.Type = type;
			newCard.BankUser = user;
			newCard.CVV = string.Format("{0:000}", new Random().Next(1000));
			newCard.PIN = string.Format("{0:0000}", new Random().Next(10000));
			user.Cards.Add(newCard);
			db.SaveChanges();
			return newCard.ID;
		}

		public decimal ConvertCurrency(Currency from, Currency to, decimal amount)
		{
			decimal fromRate = Currencies[from];
			decimal toRate = Currencies[to];
			return amount * fromRate / toRate;
		}

		public decimal BackConvertCurrency(Currency from, Currency to, decimal converted)
		{
			decimal fromRate = Currencies[from];
			decimal toRate = Currencies[to];
			return converted * toRate / fromRate;
		}

		public IEnumerable<TransactionLog> GetLog(Account account, DateTime startDate, DateTime endDate)
		{
			return
				db.Transactions.Where(t => t.FromAccount == account && t.Time >= startDate && t.Time <= endDate)
				.ToList().Select(t => new TransactionLog(t, true)).Concat(
				db.Transactions.Where(t => t.ToAccount == account && t.Time >= startDate && t.Time <= endDate)
				.ToList().Select(t => new TransactionLog(t, false))).ToList();
			
		}

		public void ReplenishAccount(Account account, decimal amount)
		{
			Transaction t = new Transaction();
			{
				t.Time = DateTime.Now;

				t.FromAccountNumber = "0000000000000";

				t.TransactionCurrency = account.Currency;
				t.TransactionAmount = amount;

				t.ToAccountNumber = account.AccountNumber;
				t.ToAccount = account;
				t.ToAccountBackupAmount = account.Amount;
				t.ToAccountCurrency = account.Currency;
				t.ToAccountDelta = amount;
				t.State = TransactionState.Opened;
				db.Transactions.Add(t);
				db.SaveChanges();
				account.Amount += t.ToAccountDelta;
				t.State = TransactionState.Closed;
				db.SaveChanges();
			}
		}

		public void WithdrawAccount(Account account, decimal amount)
		{
			Transaction t = new Transaction();
			{
				t.Time = DateTime.Now;
				t.FromAccountBackupAmount = account.Amount;
				t.FromAccountNumber = account.AccountNumber;
				t.FromAccount = account;
				t.FromAccountDelta = -amount;
				t.FromAccountCurrency = account.Currency;

				t.TransactionCurrency = account.Currency;
				t.TransactionAmount = amount;

				t.ToAccountNumber = "0000000000000";

				t.State = TransactionState.Opened;
				db.Transactions.Add(t);
				db.SaveChanges();

				account.Amount += t.FromAccountDelta;
				t.State = TransactionState.Closed;
				db.SaveChanges();
			}
		}

		private void Pay(PaymentTemplate template)
		{
			Transaction t = null;
			PaymentEntry entry = new PaymentEntry();
			entry.Template = template;
			entry.StartTime = DateTime.Now;
			Prerequisite requisite = ERIP.GetPrerequisites(template.EripType);
			Account receiver = db.FindAccount(requisite.AccountNumber);
			Account sender = template.Account;
			try
			{
				t = new Transaction();

				Transact(t, sender, receiver, requisite.Currency, template.Amount);

				t.Payment = entry;
				db.Payments.Add(entry);
				db.SaveChanges();
				ERIP.SendPayment(template.EripType, template.JsonPayment, template.Amount);
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

		private void Transact(Transaction t, Account from, Account to, Currency currency, decimal amount)
		{
			t.Time = DateTime.Now;
			t.FromAccountBackupAmount = from.Amount;
			t.FromAccountNumber = from.AccountNumber;
			t.FromBank = thisBankGuid;
			t.FromAccount = from;
			t.FromAccountDelta = -BackConvertCurrency(from.Currency, currency, amount);
			t.FromAccountCurrency = from.Currency;

			t.TransactionCurrency = currency;
			t.TransactionAmount = amount;

			t.ToAccountNumber = to.AccountNumber;
			t.ToAccount = to;
			t.ToAccountBackupAmount = to.Amount;
			t.ToAccountCurrency = to.Currency;
			t.ToAccountDelta = ConvertCurrency(currency, to.Currency, amount);
			t.State = TransactionState.Opened;
			db.Transactions.Add(t);
			db.SaveChanges();

			from.Amount += t.FromAccountDelta;
			to.Amount += t.ToAccountDelta;
			db.SaveChanges();
			t.State = TransactionState.Closed;
		}

		private void StartProcessing()
		{
			while (true)
			{
				DateTime now = DateTime.Now.Date;

				foreach (Schedule schedule in db.Schedules)
				{
					DateTime nextPay = DateTime.Now;
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
						Pay(schedule.Template);
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

		private void RollbackTransaction(Transaction t)
		{
			if (t.FromAccount != null)
			{
				Account acc = t.FromAccount;
				acc.Amount = t.FromAccountBackupAmount;
			}
			else
			{
				RollbackOuterAccount(t.FromAccountNumber, t.FromAccountCurrency, t.FromAccountBackupAmount);
			}

			if (t.ToAccount != null)
			{
				Account acc = t.ToAccount;
				acc.Amount = t.ToAccountBackupAmount;
			}
			else
			{
				RollbackOuterAccount(t.ToAccountNumber, t.ToAccountCurrency, t.ToAccountBackupAmount);
			}
		}

		private void RollbackOuterAccount(string accountNumber, Currency currency, decimal value)
		{
			//TODO let arbiter know about failed transaction
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
			cardClass.Types.Add(new CardType() { Name = "Virtuon", Class = cardClass });
			CardType cardType = new CardType() { Name = "Electron", Class = cardClass };
			cardClass.Types.Add(cardType);
			cardClass.Types.Add(new CardType() { Name = "Classic", Class = cardClass });
			cardClass.Types.Add(new CardType() { Name = "Gold", Class = cardClass });
			cardClass.Types.Add(new CardType() { Name = "Black Card", Class = cardClass });
			cardClass.Types.FirstOrDefault(t => { context.CardTypes.Add(t); return false; });

			context.CardClasses.Add(cardClass);

			CardClass cardClass2 = new CardClass { Name = "MasterCard" };
			cardClass2.Types.Add(new CardType() { Name = "Standard", Class = cardClass });
			cardClass2.Types.Add(new CardType() { Name = "Standard Autohelp", Class = cardClass });
			cardClass2.Types.Add(new CardType() { Name = "Gold", Class = cardClass });
			cardClass2.Types.FirstOrDefault(t => { context.CardTypes.Add(t); return false; });

			context.CardClasses.Add(cardClass2);

			context.SaveChanges();

			InternetBankingUser admin = new InternetBankingUser();
			admin.Login = "root";
			admin.Salt = Guid.NewGuid().ToString("N");
			admin.PasswordHash = UserService.PasswordDistortion("root", admin.Salt);
			admin.Role = context.Roles.FirstOrDefault((r) => r.Name == "admin");
			context.InternetBankingUsers.Add(admin);

			context.SaveChanges();

			Account velcomAccount = new Account();
			velcomAccount.Currency = Currency.BYR;
			velcomAccount.Amount = 5000000;
			context.Accounts.Add(velcomAccount);
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
			card.PIN = "8844";
			card.ExpirationDate = DateTime.Now + TimeSpan.FromDays(365);
			card.Type = cardType;
			account.Currency = Currency.USD;
			account.Amount = 10000;
			account.Owner = user;

			InternetBankingUser ibu = new InternetBankingUser();
			ibu.BankUser = user;
			ibu.Login = "user";
			ibu.Salt = Guid.NewGuid().ToString("N");
			ibu.PasswordHash = UserService.PasswordDistortion("user", ibu.Salt);
			ibu.Role = context.Roles.FirstOrDefault((r) => r.Name == "user");
			context.InternetBankingUsers.Add(ibu);
			context.Accounts.Add(account);
			context.Cards.Add(card);
			context.BankUsers.Add(user);
			context.SaveChanges();
		}
	}
}
