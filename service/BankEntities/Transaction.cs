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

		[DataType(DataType.DateTime)]
		public DateTime Time { get; set; }

		//From
		public Guid FromBank { get; set; }

		public Account FromAccount { get; set; }

		[Required]
		public string FromAccountNumber { get; set; }
		
		public decimal FromAccountBackupAmount { get; set; }

		public decimal FromAccountDelta { get; set; }

		public Currency FromAccountCurrency { get; set; }
		
		//To
		public Guid ToBank { get; set; }

		public Account ToAccount { get; set; }

		[Required]
		public string ToAccountNumber { get; set; }

		public decimal ToAccountBackupAmount { get; set; }

		public decimal ToAccountDelta { get; set; }

		public Currency ToAccountCurrency { get; set; }
		
		public TransactionState State { get; set; }

		public PaymentEntry Payment { get; set; }

		public string Description { get; set; }
	}
}
