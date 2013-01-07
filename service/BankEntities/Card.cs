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

		public string Holder { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime? FreezeDate { get; set; }

		[Required]
		public string CVV { get; set; }

		[Required]
		public string PIN { get; set; }

		public bool IsExpired
		{
			get
			{
				return DateTime.Now >= ExpirationDate;
			}
		}

		public CardState State
		{
			get
			{
				if (IsExpired)
				{
					return CardState.Expired;
				}
				else if (FreezeDate != null)
				{ 
					return CardState.Frozen;
				}
				else
				{
					return CardState.Valid;
				}
			}
		}

		public virtual ICollection<Account> Accounts { get; set; }

		[DataType(DataType.DateTime)]
		public DateTime ExpirationDate { get; set; }

		[Required]
		public virtual CardType Type { get; set; }
	}

	public enum CardState
	{ 
		Valid,
		Frozen,
		Expired,
	}
}
