using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;
namespace BankSystem
{
	public class BankSchedule
	{
		public int ID { get; set; }
		public PaymentRequisites Requisite { get; set; }
		public ScheduleBit ScheduleBit { get; set; }
		public int BitQuantity { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime LastTimeExecuted { get; set; }
		public int? RepeatsLeft { get; set; }
	}
}
