using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class Role
	{
		[Key]
		public int ID { get; set; }

		[Required]
		public string Name { get; set; }

		public override string ToString()
		{
			return Name;
		}
	}
}
