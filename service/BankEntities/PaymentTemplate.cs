using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class PaymentTemplate
	{
		[Key]
		public int ID { get; set; }

		[Required]
		public string JsonPayment { get; set; }
		
		public int Amount { get; set; }

		public Currency Currency { get; set; }
	}
}
