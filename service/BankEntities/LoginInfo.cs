using BankEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BankEntities
{
	public class LoginInfo
	{
		public InternetBankingUser User { get; set; }
		public DateTime LogonTime { get; set; }
		public DateTime LastActivity { get; set; }
		public string UserAgent { get; set; }
		public string UserHost { get; set; }
		public Guid UID { get; set; }
		public TimeSpan TimeLeft
		{
			get
			{
				return LastActivity + TimeSpan.FromMinutes(2) - DateTime.Now;
			}
		}
	}
}