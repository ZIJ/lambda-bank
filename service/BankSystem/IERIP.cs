using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;

namespace BankSystem
{
	public interface IERIP
	{
		object SendPayment(EripPaymentType type, string jsonPayment, decimal amount);

		object GetPaymentInfo(EripPaymentType type, string jsonPayment);

		Prerequisite GetPrerequisites(EripPaymentType type);
	}

	public class Prerequisite
	{
		public Prerequisite()
		{
			Rate = 1;
		}

		public Guid BankGuid { get; set; }

		public string AccountNumber { get; set; }

		public Currency Currency { get; set; }

		public decimal Rate { get; set; }
	}

	public class PaymentCheck
	{
		public string Agent { get; set; }

		public string CheckNumber { get; set; }
	}
}
