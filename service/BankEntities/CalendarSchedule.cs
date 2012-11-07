using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class CalendarSchedule
	{
		[Key]
		public int ID { get; set; }

		public int? Hour { get; set; }

		public int? DayOfWeek { get; set; }

		public int? DayOfMonth { get; set; }

		public int? Month { get; set; }

		[Required]
		public PaymentTemplate Template { get; set; }

		[Required]
		public BankUser User { get; set; }
	}
}
