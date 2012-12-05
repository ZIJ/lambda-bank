using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public interface IERIP
	{
		void SendPayment(EripPaymentType type, string jsonPayment);

		object GetPaymentInfo(EripPaymentType type, string jsonPayment);

		Prerequisite GetPrerequisites(EripPaymentType type);
	}

	public class Prerequisite
	{
		public Guid BankGuid { get; set; }

		public string AccountNumber { get; set; }

		public Currency Currency { get; set; }
	}

	public enum EripPaymentType
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
