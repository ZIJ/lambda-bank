using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace BankEntities
{
	public class PaymentEntry
	{
		[Key]
		public int ID { get; set; }

		public PaymentTemplate Template { get; set; }

		public DateTime StartTime { get; set; }
	}
}
