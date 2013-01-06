using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public class TransferInfo
	{
		[Key]
		public int ID { get; set; }
		public string Target { get; set; }
		public string Notes { get; set; }
	}
}
