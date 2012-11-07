using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;
using System.Data.Entity;
namespace ConsoleTest
{
	class Program
	{
		static void Main(string[] args)
		{
			Database.SetInitializer<BankDatabase>(new DropCreateDatabaseIfModelChanges<BankDatabase>());
			//Database.SetInitializer<BankDatabase>(new DropCreateDatabaseAlways<BankDatabase>());
			BankDatabase db = new BankDatabase();
			foreach (BankUser user in db.BankUsers)
			{
				Console.WriteLine(user.Name);
			}
			/*BankUser ss = db.BankUsers.Add(new BankUser() { Name = "user1" });
			ss.Cards.Add(new Card() { CardNumber = "3120000000000001", CVV = 698, ExpirationDate = DateTime.Now });
			Account testAccount = new Account() { AccountNumber = "3120000000001", Amount = 100, Currency = Currency.USD };
			testAccount.Cards.Add(ss.Cards.First());
			db.Accounts.Add(testAccount);
			InternetBankingUser ibUser = new InternetBankingUser() { BankUser = ss, Login = "root", PasswordHash = "toor", Salt = "asdf" };
			db.InternetBankingUsers.Add(ibUser);
			db.SaveChanges();*/
		}
	}
}
