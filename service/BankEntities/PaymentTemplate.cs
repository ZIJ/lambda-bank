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

		public int DbStubType { get; set; }

		public TemplateType Type
		{
			get { return (TemplateType)DbStubType; }
			set { DbStubType = (int)value; }
		}

		public int DbStubEripType { get; set; }

		public EripPaymentType EripType
		{
			get { return (EripPaymentType)DbStubEripType; }
			set { DbStubEripType = (int)value; }
		}		
	}

	public enum TemplateType
	{
		OneTime,
		Scheduled,
		Saved
	}
}
