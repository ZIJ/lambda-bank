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

		private IERIP ERIP = new EripImplementers.EripImlemetation();

		private Guid thisBankGuid;

		private Dictionary<Currency, decimal> currencyRates = null;

		public Bank()
		{
			Guid bankId = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}");
			thisBankGuid = bankId;
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

		public static readonly Guid FirstBankGuid = new Guid("{79928B2B-641A-42B2-B790-9B02BF50D30C}");

		public static readonly Guid SecondBankGuid = new Guid("{D8C62C10-0FDA-421F-ACA6-CF17CA8D6961}");

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
					AmountCharged = amount,
					ChangeId = UserService.PasswordDistortion(account.Amount.ToString(), "res"),
					EnoughMoney = amountCharged >= account.Amount
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

					if (changeId == null || changeId != UserService.PasswordDistortion(account.Amount.ToString(), "res"))
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
			newCard.CVV = string.Format("{0:3}", new Random().Next(1000));
			newCard.PIN = string.Format("{0:4}", new Random().Next(10000));
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

		private decimal ConvertCurrency(Currency from, Currency to, decimal amount)
		{
			decimal fromRate = Currencies[from];
			decimal toRate = Currencies[to];
			return amount * fromRate / toRate;
		}

		private decimal BackConvertCurrency(Currency from, Currency to, decimal converted)
		{
			decimal fromRate = Currencies[from];
			decimal toRate = Currencies[to];
			return converted * toRate / fromRate;
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

		private void Pay(PaymentTemplate template)
		{
			Transaction t = null;
			PaymentEntry entry = new PaymentEntry();
			entry.Template = template;
			entry.StartTime = DateTime.Now;
			
			Account account = template.Account;
			try
			{
				Prerequisite requisite = ERIP.GetPrerequisites(template.EripType);
				bool internalTransaction = requisite.BankGuid == thisBankGuid;
				Account receiver = null;
				t = new Transaction();
				t.FromAccountBackupAmount = account.Amount;
				t.FromAccountNumber = account.AccountNumber;
				t.FromBank = thisBankGuid;
				t.FromAccountID = account.ID;
				t.FromAccountDelta = -BackConvertCurrency(account.Currency, requisite.Currency, template.Amount);
				t.FromAccountCurrency = account.Currency;

				t.ToBank = requisite.BankGuid;
				t.ToAccountNumber = requisite.AccountNumber;

				if (internalTransaction)
				{
					receiver = db.FindAccount(requisite.AccountNumber);
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
					bp.Amount = template.Amount;
					bp.FromBank = thisBankGuid;
					bp.ToBank = requisite.BankGuid;
					bp.FromAccountNumber = account.AccountNumber;
					bp.ToAccountNumber = requisite.AccountNumber;
					bp.Currency = requisite.Currency;
					BankArbiter.Transact(bp);
				}
				t.State = TransactionState.Closed;
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
			account.Currency = Currency.BYR;
			account.Amount = 10000000;

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
