using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class SpanSchedule
	{
		[Key]
		public int ID { get; set; }

		public DateTime LastTime { get; set; }

		public TimeSpan Span { get; set; }

		public PaymentTemplate Template { get; set; }

		[Required]
		public BankUser User { get; set; }
	}
}
