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

		public string AccountNumber
		{
			get
			{
				return string.Format("435983{0:0000000}", ID);
			}
		}

		public Currency Currency { get; set; }

		[Required]
		public decimal Amount { get; set; }

		[IgnoreDataMember]
		public virtual ICollection<Card> Cards { get; set; }

		public BankUser Owner { get; set; }
	}
}
