using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class PaymentTemplate
	{
		public PaymentTemplate()
		{
			Entries = new HashSet<PaymentEntry>();
		}

		[Key]
		public int ID { get; set; }

		[Required]
		public string JsonPayment { get; set; }
		
		public decimal Amount { get; set; }

		[Required]
		public BankUser Owner { get; set; }

		[Required]
		public Account Account { get; set; }

		public ICollection<PaymentEntry> Entries { get; set; }

		public TemplateType Type { get; set; }

		public EripPaymentType EripType { get; set; }
	}

	public enum TemplateType
	{
		OneTime,
		Scheduled,
		Saved
	}
}
