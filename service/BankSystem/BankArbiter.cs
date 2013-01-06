using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;

namespace BankSystem
{
	public static class BankArbiter
	{
		private static Dictionary<Guid, Bank> banks = new Dictionary<Guid, Bank>();

		public static void Transact(BankPayment payment)
		{
			Bank incoming = banks[payment.ToBank];
			incoming.IncomingPay(payment);
		}

		public static Dictionary<Guid, Bank> Banks
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

		public Currency Currency { get; set; }
	}
}
