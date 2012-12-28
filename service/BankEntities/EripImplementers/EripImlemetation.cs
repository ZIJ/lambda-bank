using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities.EripImplementers
{
	class EripImlemetation: IERIP
	{
		private Dictionary<EripPaymentType, ISupplier> operators = new Dictionary<EripPaymentType, ISupplier>();

		public EripImlemetation()
		{
		}

		public object GetPaymentInfo(EripPaymentType type, string jsonPayment)
		{
			return operators[type].GetPaymentInfo(jsonPayment);
		}

		public Prerequisite GetPrerequisites(EripPaymentType type)
		{
			return operators[type].Requisite;
		}

		public object SendPayment(EripPaymentType type, string jsonPayment, decimal amount)
		{
			return operators[type].SendPayment(jsonPayment, amount);
		}
	}
}
