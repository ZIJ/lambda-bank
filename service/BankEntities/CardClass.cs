using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace BankEntities
{
	public class CardClass
	{
		public CardClass()
		{
			Types = new HashSet<CardType>();
		}

		[Key]
		public int ID { get; set; }

		[Required]
		public string Name { get; set; }

		public virtual ICollection<CardType> Types { get; private set; }
	}
}
