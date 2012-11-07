using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
namespace BankEntities
{
	public class InternetBankingUser
	{
		[Key]
		public int ID { get; set; }

		public BankUser BankUser { get; set; }

		[Required]
		public string Login { get; set; }

		[Required]
		public string PasswordHash { get; set; }

		[Required]
		public string Salt { get; set; }

		[Required]
		public virtual Role Role { get; set; }
	}
}
