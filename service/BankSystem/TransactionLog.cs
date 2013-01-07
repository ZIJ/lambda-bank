using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;
namespace BankSystem
{
	public class TransactionLog
	{
		public DateTime Time { get; set; }

		public string Description { get; set; }

		public string FromAccount { get; set; }
		public string ToAccount { get; set; }

		public decimal TransactionAmount { get; set; }
		public Currency TransactionCurrency { get; set; }

		public decimal AccountChange { get; set; }
		public Currency AccountCurrency { get; set; }
	}
}
