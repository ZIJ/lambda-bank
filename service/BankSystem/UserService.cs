using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using BankEntities;

namespace BankSystem
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
			authenticatedUsers.Add(new Guid("7ab37b8c-2e92-4493-a40c-8425750c3d59"), new LoginInfo() { LastActivity = DateTime.Now + TimeSpan.FromDays(1), User = db.InternetBankingUsers.First(), UID = new Guid("7ab37b8c-2e92-4493-a40c-8425750c3d59")});
			authenticatedUsers.Add(new Guid("c59b9bd7-ddc6-4cf6-9036-9c678b44e093"), new LoginInfo() { LastActivity = DateTime.Now + TimeSpan.FromDays(1), User = db.InternetBankingUsers.Where(u => u.Role.Name == "user").First(), UID = new Guid("c59b9bd7-ddc6-4cf6-9036-9c678b44e093") });
		}

		public LoginInfo Logon(string login, string password)
		{
			InternetBankingUser user = db.InternetBankingUsers.ToList().Where(
				u => u.Login == login && u.PasswordHash == PasswordDistortion(password, u.Salt)).FirstOrDefault();
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
			login = System.Web.Security.Membership.GeneratePassword(9, 0).ToUpper();
			password = System.Web.Security.Membership.GeneratePassword(12, 2);
			InternetBankingUser internetUser = db.InternetBankingUsers.Where(u => u.BankUser.ID == user.ID).FirstOrDefault();
			if (internetUser == null)
			{
				internetUser = new InternetBankingUser();
				db.InternetBankingUsers.Add(internetUser);
			}
			else
			{
				LoginInfo info = authenticatedUsers.Values.Where(l => l.User == internetUser).FirstOrDefault();
				if (info != null)
				{
					authenticatedUsers.Remove(info.UID);
				}
			}
			internetUser.Login = login;
			internetUser.Salt = Guid.NewGuid().ToString("N");
			internetUser.PasswordHash = PasswordDistortion(password, internetUser.Salt);
			internetUser.BankUser = user;
			internetUser.Role = db.Roles.FirstOrDefault((r) => r.Name == "User");
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
