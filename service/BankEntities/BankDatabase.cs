using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public class BankDatabase:DbContext
	{
		public BankDatabase(string connection) : base(connection) { }

		public DbSet<BankUser> BankUsers { get; set; }

		public DbSet<InternetBankingUser> InternetBankingUsers { get; set; }

		public DbSet<Card> Cards { get; set; }

		public DbSet<Account> Accounts { get; set; }

		public DbSet<Transaction> Transactions { get; set; }

		public DbSet<PaymentEntry> Payments { get; set; }

		public DbSet<PaymentTemplate> PaymentTemplates { get; set; }

		public DbSet<CalendarSchedule> CalendarSchelules { get; set; }

		public DbSet<Schedule> Schedules { get; set; }

		public DbSet<Role> Roles { get; set; }

		public DbSet<CardClass> CardClasses { get; set; }

		public DbSet<CardType> CardTypes { get; set; }
	}
}
