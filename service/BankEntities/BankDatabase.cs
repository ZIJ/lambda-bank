using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public class BankDatabase:DbContext
	{

		public BankDatabase() : base("BankDatabase") { }

		public DbSet<BankUser> BankUsers { get; set; }

		public DbSet<InternetBankingUser> InternetBankingUsers { get; set; }

		public DbSet<Card> Cards { get; set; }

		public DbSet<Account> Accounts { get; set; }

		public DbSet<Transaction> Transactions { get; set; }

		public DbSet<PaymentEntry> Payments { get; set; }

		public DbSet<PaymentTemplate> PaymentTemplates { get; set; }

		public DbSet<CalendarSchedule> CalendarSchelules { get; set; }

		public DbSet<SpanSchedule> SpanSchedules { get; set; }

		public DbSet<Role> Roles { get; set; }
	}
}
