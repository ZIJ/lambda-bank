using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace BankEntities
{
	public class Card
	{
		public Card()
		{
			Accounts = new HashSet<Account>();
		}
		[Key]
		public int ID { get; set; }

		[Required]
		public virtual BankUser BankUser { get; set; }

		public string CardNumber
		{
			get
			{
				return string.Format("435983{0:0000000000}", ID);
			}
		}

		[Required]
		public string CVV { get; set; }

		public virtual ICollection<Account> Accounts { get; set; }

		public DateTime ExpirationDate { get; set; }

		[Required]
		public virtual CardType Type { get; set; }
	}
}
