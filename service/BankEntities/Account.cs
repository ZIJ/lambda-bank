using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace BankEntities
{
	public class Account
	{
		public Account()
		{
			Cards = new HashSet<Card>();
		}

		[Key]
		public int ID { get; set; }

		[MinLength(13)]
		[MaxLength(13)]
		public string AccountNumber { get; set; }

		[Required]
		public Currency Currency { get; set; }

		[Required]
		public decimal Amount { get; set; }

		public virtual ICollection<Card> Cards { get; set; }
	}
}
