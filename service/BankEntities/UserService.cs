using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace BankEntities
{
	public class UserService
	{
		private Bank bank = null;

		private BankDatabase db = null;

		private Dictionary<Guid, LoginInfo> authenticatedUsers = new Dictionary<Guid, LoginInfo>();

		public UserService(Bank bank)
		{
			this.bank = bank;
			db = bank.Database;
		}

		public LoginInfo Logon(string login, string password)
		{
			InternetBankingUser user = db.InternetBankingUsers.ToList().Where(
				u => u.Login == login && u.PasswordHash == PasswordDistortion(password, u.Salt)).FirstOrDefault();
			//user = db.InternetBankingUsers.Find(user.ID);
			if (user == null)
			{
				return null;
			}
			LoginInfo info = new LoginInfo();
			info.User = user;
			info.LogonTime = DateTime.Now;
			info.LastActivity = DateTime.Now;
			info.UID = Guid.NewGuid();
			lock (authenticatedUsers)
			{
				authenticatedUsers.Add(info.UID, info);
			}
			return info;
		}

		public void Logout(Guid securityToken)
		{
			lock (authenticatedUsers)
			{
				authenticatedUsers.Remove(securityToken);
			}
		}

		public LoginInfo GetUser(Guid securityToken, bool updateActivity = true)
		{
			LoginInfo info;
			if (!authenticatedUsers.TryGetValue(securityToken, out info) || info.TimeLeft.TotalSeconds < 0)
			{
				return null;
			}
			if (updateActivity)
			{
				info.LastActivity = DateTime.Now;
			}

			return info;
		}


		public void GenerateInternetBankingUser(BankUser user, out string login, out string password)
		{
			if (db.InternetBankingUsers.Any(u => u.BankUser.ID == user.ID))
			{
				throw new ArgumentOutOfRangeException("user not found");
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

		public static string PasswordDistortion(string password, string salt)
		{
			using (var cryptoProvider = new SHA1CryptoServiceProvider())
			{
				UnicodeEncoding encoder = new UnicodeEncoding();
				return BitConverter.ToString(cryptoProvider.ComputeHash(encoder.GetBytes(password + salt)));
			}
		}
	}
}
