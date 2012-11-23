using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace BankEntities
{
	public class Transaction
	{
		[Key]
		public int ID { get; set; }

		[Required]
		public byte[] FromAccountNumber { get; set; }

		public int? FromAccountID { get; set; }

		public decimal FromAccountBackupAmount { get; set; }

		public decimal FromAccountDelta { get; set; }

		public Currency FromAccountCurrency { get; set; }

		[Required]
		public byte[] ToAccountNumber { get; set; }

		public int? ToAccountID { get; set; }

		public decimal ToAccountBackupAmount { get; set; }

		public decimal ToAccountDelta { get; set; }

		public Currency ToAccountCurrency { get; set; }

		public TransactionState State { get; set; }

		public PaymentEntry Payment { get; set; }
	}
}
