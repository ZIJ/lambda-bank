using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BankEntities
{
	public class Schedule
	{
		[Key]
		public int ID { get; set; }

		public DateTime LastTime { get; set; }

		public DateTime StartTime { get; set; }

		public int DbStubScheduleBit { get; set; }

		public ScheduleBit ScheduleBit
		{
			get { return (ScheduleBit)DbStubScheduleBit; }
			set { DbStubScheduleBit = (int)value; }
		}
		
		public int BitQuantity { get; set; }

		[IgnoreDataMember]
		public PaymentTemplate Template { get; set; }

		public int? RepeatsLeft { get; set; }

		[IgnoreDataMember]
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
