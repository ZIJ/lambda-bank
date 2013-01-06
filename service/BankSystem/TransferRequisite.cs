using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;

namespace BankSystem
{
	public class TransferRequisite
	{
		public int FromAccountId { get; set; }
		public int? ToAccountId { get; set; }
		public string ToAccountNumber { get; set; }
		public Currency Currency { get; set; }
		public decimal Amount { get; set; }
		public string ChangeId { get; set; }
	}
}
