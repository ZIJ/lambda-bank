using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;

namespace BankSystem.EripImplementers
{
	class EripImlemetation: IERIP
	{
		private Dictionary<EripPaymentType, ISupplier> operators = new Dictionary<EripPaymentType, ISupplier>();

		public EripImlemetation()
		{
			operators.Add(EripPaymentType.Velcom, new DefaultSupplier() 
			{ 
				Type = SupplierType.CreditDebet, 
				MoneyBase = 20000, 
				Requisite = new Prerequisite() 
				{ 
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"), 
					AccountNumber = "4359830000001", 
					Currency = Currency.BYR 
				} 
			});
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
