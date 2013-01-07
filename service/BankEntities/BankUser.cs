using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace BankEntities
{
	public class BankUser
	{
		public BankUser()
		{
			Cards = new HashSet<Card>();
			Schedules = new HashSet<Schedule>();
			Payments = new HashSet<PaymentTemplate>();
		}
		[Key]
		public int ID { get; set; }

		[Required]
		public string FirstName { get; set; }

		[Required]
		public string LastName { get; set; }

		[Required]
		public string PassportNumber { get; set; }

		[Required]
		public string Address { get; set; }

		public bool IsDisabled { get; set; }

		public virtual ICollection<Card> Cards { get; set; }

		public virtual ICollection<Schedule> Schedules { get; set; }

		public virtual ICollection<PaymentTemplate> Payments { get; set; }

		public ICollection<PaymentTemplate> SavedPayments
		{
			get
			{
				return Payments.Where(t => t.Type == TemplateType.Saved).ToList();
			}
		}

		public bool OwnsAccount(Account account)
		{
			return this.Cards.SelectMany(c => c.Accounts).Any(a => a.ID == account.ID);
		}
	}
}
