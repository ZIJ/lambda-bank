using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using BankEntities;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel.Web;
using System.Data.Entity;
using System.Configuration;
using System.Net;
namespace BankService
{
	public class BankDaemon
	{
		private Dictionary<Guid, LoginInfo> authenticatedUsers = new Dictionary<Guid, LoginInfo>();

		private BankDatabase db = null;

		public BankDaemon()
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
		}

		public BankDatabase Database
		{
			get
			{
				return db;
			}
		}

		public void StartProcessing()
		{ 
			//start daemon
		}

		public LoginInfo Logon(string login, string password)
		{
			InternetBankingUser user = db.InternetBankingUsers.ToList().Where(
				u => u.Login == login && u.PasswordHash == PasswordDistortion(password, u.Salt)).FirstOrDefault();
			user = db.InternetBankingUsers.Find(user.ID);
			if (user == null)
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
			}
			LoginInfo info = new LoginInfo();
			info.User = user;
			info.LogonTime = DateTime.Now;
			info.LastActivity = DateTime.Now;
			info.UID = Guid.NewGuid();
			authenticatedUsers.Add(info.UID, info);
			return info;
		}

		private static string PasswordDistortion(string password, string salt)
		{
			using (var cryptoProvider = new SHA1CryptoServiceProvider())
			{
				UnicodeEncoding encoder = new UnicodeEncoding();
				return BitConverter.ToString(cryptoProvider.ComputeHash(encoder.GetBytes(password + salt)));
			}
		}

		public LoginInfo GetUser(Guid securityToken)
		{
			LoginInfo info;
 			if (!authenticatedUsers.TryGetValue(securityToken, out info))
			{
				throw new WebFaultException(HttpStatusCode.Unauthorized);
			}
			return info;
		}

		public void GenerateInternetBankingUser(BankUser user, out string login, out string password)
		{
			if (db.InternetBankingUsers.Any(u => u.BankUser.ID == user.ID))
			{
				throw new WebFaultException(HttpStatusCode.Conflict);
			}
			password = System.Web.Security.Membership.GeneratePassword(12, 2);
			login = System.Web.Security.Membership.GeneratePassword(9, 0).ToUpper();

			InternetBankingUser internetUser = new InternetBankingUser();
			internetUser.Login = login;
			internetUser.Salt = Guid.NewGuid().ToString("N");
			internetUser.PasswordHash = PasswordDistortion(password, internetUser.Salt);
			internetUser.BankUser = user;
			internetUser.Role = db.Roles.FirstOrDefault((r) => r.Name == "User");
			db.InternetBankingUsers.Add(internetUser);
			db.SaveChanges();
		}



		private class DefaultInitializer : System.Data.Entity.DropCreateDatabaseAlways<BankDatabase>// DropCreateDatabaseIfModelChanges<BankDatabase>
		{
			protected override void Seed(BankDatabase context)
			{
				context.Roles.Add(new Role() { Name = "User" });
				context.Roles.Add(new Role() { Name = "Operator" });
				context.Roles.Add(new Role() { Name = "Admin" });
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
				admin.PasswordHash = PasswordDistortion("root", admin.Salt);
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
}