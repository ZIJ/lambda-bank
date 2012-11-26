using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public class BankArbiter
	{
		private Dictionary<Guid, Bank> banks = new Dictionary<Guid, Bank>();

		public void Transact(BankPayment payment)
		{
			try
			{

			}
			catch
			{

			}
		}

		public Dictionary<Guid, Bank> Banks
		{
			get
			{
				return banks;
			}
		}
	}

	public class BankPayment
	{
		public Guid FromBank { get; set; }
		public Guid ToBank { get; set; }

		public string FromAccountNumber { get; set; }
		public string ToAccountNumber { get; set; }

		public decimal Amount { get; set; }
	}
}
