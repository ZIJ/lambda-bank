using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;
namespace BankSystem
{
	public class TransactionLog
	{
		public TransactionLog(Transaction transaction, bool relativeFrom)
		{
			Time = transaction.Time;
			Description = transaction.Description;
			FromAccount = transaction.FromAccountNumber == "0000000000000" ? "Bank Facility, Operator" : transaction.FromAccountNumber;
			ToAccount = transaction.ToAccountNumber == "0000000000000" ? "Bank Facility, Operator" : transaction.ToAccountNumber;
			TransactionAmount = transaction.TransactionAmount;
			TransactionCurrency = transaction.TransactionCurrency;
			if (relativeFrom)
			{
				AccountChange = transaction.FromAccountDelta;
				AccountCurrency = transaction.FromAccountCurrency;
			}
			else
			{
				AccountChange = transaction.ToAccountDelta;
				AccountCurrency = transaction.ToAccountCurrency;
			}
		}
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
