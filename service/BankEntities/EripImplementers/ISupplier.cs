using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities.EripImplementers
{
	interface ISupplier
	{
		Prerequisite Requisite { get; }

		object GetPaymentInfo(string jsonPayment);

		object SendPayment(string jsonPayment, decimal amount);

	}
}
