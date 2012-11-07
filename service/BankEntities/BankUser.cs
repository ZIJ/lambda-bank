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
			SpanSchedules = new HashSet<SpanSchedule>();
			CalendarSchedules = new HashSet<CalendarSchedule>();
		}
		[Key]
		public int ID { get; set; }

		[Required]
		public string Name { get; set; }

		public virtual ICollection<Card> Cards { get; set; }

		public virtual ICollection<SpanSchedule> SpanSchedules { get; set; }

		public virtual ICollection<CalendarSchedule> CalendarSchedules { get; set; }
	}
}
