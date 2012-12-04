using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public interface IERIP
	{
		void SendPayment(ERIPPaymentType type, string jsonPayment);

		object GetPaymentInfo(ERIPPaymentType type, string jsonPayment);

		Prerequisite GetPrerequisites(ERIPPaymentType type);
	}

	public class Prerequisite
	{
		public Guid BankGuid { get; set; }

		public string AccountNumber { get; set; }

		public Currency Currency { get; set; }
	}

	public enum ERIPPaymentType
	{
		Velcom,
		Mts,
		Life,
		Beltelecom,
		ElectroService,
		AquaService,
		BusinessNetwork,
		AtlantTelecom,
		AdslBy,
		Solo
	}
}
