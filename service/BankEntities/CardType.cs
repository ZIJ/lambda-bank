using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public class CardType
	{
		[Key]
		public int ID { get; set; }
		public string Name { get; set; }

		[Required]
		public virtual CardClass Class { get; set; }
	}
}