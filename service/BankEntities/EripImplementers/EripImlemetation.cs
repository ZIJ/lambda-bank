using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities.EripImplementers
{
	class EripImlemetation: IERIP
	{
		//private Dictionary<EripPaymentType, Operator> operators = new Dictionary<EripPaymentType, Operator>();

		public EripImlemetation()
		{
		}

		public object GetPaymentInfo(EripPaymentType type, string jsonPayment)
		{
			throw new NotImplementedException();
		}

		public Prerequisite GetPrerequisites(EripPaymentType type)
		{
			throw new NotImplementedException();
		}

		public void SendPayment(EripPaymentType type, string jsonPayment, decimal amount)
		{
			throw new NotImplementedException();
		}
	}
}
