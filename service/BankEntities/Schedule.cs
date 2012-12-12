using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class Schedule
	{
		[Key]
		public int ID { get; set; }

		public DateTime LastTime { get; set; }

		public DateTime StartTime { get; set; }

		public ScheduleBit ScheduleBit { get; set; }

		public int BitQuantity { get; set; }

		public PaymentTemplate Template { get; set; }

		[Required]
		public BankUser User { get; set; }
	}

	public enum ScheduleBit
	{
 		Day,
		Week,
		Month,
		Year
	}
}
