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
using System.Net;
namespace BankService
{
	public class BankDaemon
	{
		private Dictionary<Guid, LoginInfo> authenticatedUsers = new Dictionary<Guid, LoginInfo>();

		private BankDatabase db = null;

		public BankDaemon()
		{
			System.Data.Entity.Database.SetInitializer(new DefaultInitializer());
			db = new BankDatabase();
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

		public void CreateUser(string login, string password, int userId)
		{
			BankUser user = db.BankUsers.Find(userId);
			InternetBankingUser internetUser = new InternetBankingUser();
			internetUser.Login = login;
			internetUser.Salt = Guid.NewGuid().ToString("N");
			internetUser.PasswordHash = PasswordDistortion(password, internetUser.Salt);
			internetUser.BankUser = user;
			internetUser.Role = db.Roles.FirstOrDefault((r) => r.Name == "User");
			db.InternetBankingUsers.Add(internetUser);
			db.SaveChanges();
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
			LoginInfo li;
 			if (!authenticatedUsers.TryGetValue(securityToken, out li))
			{
				throw new WebFaultException(HttpStatusCode.Forbidden);
			}
			return li;
		}
		private class DefaultInitializer : System.Data.Entity.DropCreateDatabaseAlways<BankDatabase>// DropCreateDatabaseIfModelChanges<BankDatabase>
		{
			protected override void Seed(BankDatabase context)
			{
				context.Roles.Add(new Role() { Name = "User" });
				context.Roles.Add(new Role() { Name = "Operator" });
				context.Roles.Add(new Role() { Name = "Admin" });
				context.SaveChanges();
				InternetBankingUser admin = new InternetBankingUser();
				admin.Login = "root";
				admin.Salt = Guid.NewGuid().ToString("N");
				admin.PasswordHash = PasswordDistortion("root", admin.Salt);
				admin.Role = context.Roles.FirstOrDefault((r) => r.Name == "Admin");
				context.InternetBankingUsers.Add(admin);

				context.SaveChanges();

				BankUser user = new BankUser();
				user.Name = "Sir Charles Jr.";
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
				account.Currency = Currency.BYR;
				account.Amount = 10000000;

				context.Accounts.Add(account);
				context.BankUsers.Add(user);
				context.Cards.Add(card);

				context.SaveChanges();
			}
		}
	}
}