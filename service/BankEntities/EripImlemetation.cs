using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities
{
	class EripImlemetation:IERIP
	{
		public void SendPayment(EripPaymentType type, string jsonPayment)
		{
			throw new NotImplementedException();
		}

		public object GetPaymentInfo(EripPaymentType type, string jsonPayment)
		{
			throw new NotImplementedException();
		}

		public Prerequisite GetPrerequisites(EripPaymentType type)
		{
			throw new NotImplementedException();
		}
	}
}
