using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace BankEntities
{
	public class BankUser
	{
		public BankUser()
		{
			Cards = new HashSet<Card>();
			SpanSchedules = new HashSet<Schedule>();
			CalendarSchedules = new HashSet<CalendarSchedule>();
		}
		[Key]
		public int ID { get; set; }

		[Required]
		public string FirstName { get; set; }

		[Required]
		public string LastName { get; set; }

		[Required]
		public string PassportNumber { get; set; }

		[Required]
		public string Address { get; set; }

		public virtual ICollection<Card> Cards { get; set; }

		public virtual ICollection<Schedule> SpanSchedules { get; set; }

		public virtual ICollection<CalendarSchedule> CalendarSchedules { get; set; }

		public virtual ICollection<PaymentTemplate> SavedPayments { get; set; }
	}
}
