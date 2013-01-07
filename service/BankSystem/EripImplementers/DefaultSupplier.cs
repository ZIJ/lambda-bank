using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankSystem.EripImplementers
{
	class DefaultSupplier : ISupplier
	{
		private static readonly Random rand = new Random();

		public int MoneyBase { get; set; }

		public SupplierType Type { get; set; }

		public virtual Prerequisite Requisite { get; set; }

		public decimal Rate { get; set; }

		Dictionary<string, SupplierClient> accounts = new Dictionary<string, SupplierClient>();

		public object GetPaymentInfo(string jsonPayment)
		{
			string account = jsonPayment.GetJsonAttribute("privateNumber");

			SupplierClient client = Get(account);
			return new
			{
				PrivateNumber = account,
				Name = client.Name,
				CurrentAmount = client.Amount,
				Dept = client.Amount < 0 ? - client.Amount : 0
			};
		}

		public object SendPayment(string jsonPayment, decimal amount)
		{
			string account = jsonPayment.GetJsonAttribute("privateNumber");
			SupplierClient client = Get(account);
			client.Amount += amount;
			return new
			{
				Check = "check"
			};
		}

		private SupplierClient Get(string id)
		{
			SupplierClient client = null;
			if (!accounts.TryGetValue(id, out client))
			{
				client = new SupplierClient();
				client.Name = SupplierClient.GenerateName();
				client.Amount = GenerateAmount();
				accounts.Add(id, client);
			}
			return client;
		}

		public virtual decimal GenerateAmount()
		{
			switch (Type)
			{
 				case SupplierType.Credit:
					return -rand.Next(MoneyBase / 10) * 10;
				case SupplierType.Debet:
					return rand.Next(MoneyBase / 10) * 10;
				case SupplierType.CreditDebet:
					return rand.Next(MoneyBase / 5) * 10 - MoneyBase;
				default:
					return 0;
			}
				 
		}
	}

	class SupplierClient
	{
		#region names
		private static readonly string[] lastNames = 
		{
			"Smith",
			"Johnson",
			"Williams",
			"Jones",
			"Brown",
			"Davis",
			"Miller",
			"Wilson",
			"Moore",
			"Taylor",
			"Anderson",
			"Thomas",
			"Jackson",
			"White",
			"Harris",
			"Martin",
			"Thompson",
			"Garcia",
			"Martinez",
			"Robinson",
			"Clark",
			"Rodriguez",
			"Lewis",
			"Lee",
			"Walker",
			"Hall",
			"Allen",
			"Young",
			"Hernandez",
			"King",
			"Wright",
			"Lopez",
			"Hill",
			"Scott",
			"Green",
			"Adams",
			"Baker",
			"Gonzalez",
			"Nelson",
			"Carter",
			"Mitchell",
			"Perez",
			"Roberts",
			"Turner",
			"Phillips",
			"Campbell",
			"Parker",
			"Evans",
			"Edwards",
			"Collins",
		};

		private static readonly string[] firstNames = 
		{
			"Mary",
			"Patricia",
			"Linda",
			"Barbara",
			"Elizabeth",
			"Jennifer",
			"Maria",
			"Susan",
			"Margaret",
			"Dorothy",
			"Lisa",
			"Nancy",
			"Karen",
			"Betty",
			"Helen",
			"Sandra",
			"Donna",
			"Carol",
			"Ruth",
			"Sharon",
			"Michelle",
			"Laura",
			"Sarah",
			"Kimberly",
			"Deborah",
			"James",
			"John",
			"Robert",
			"Michael",
			"William",
			"David",
			"Richard",
			"Charles",
			"Joseph",
			"Thomas",
			"Christopher",
			"Daniel",
			"Paul",
			"Mark",
			"Donald",
			"George",
			"Kenneth",
			"Steven",
			"Edward",
			"Brian",
			"Ronald",
			"Anthony",
			"Kevin",
			"Jason",
			"Matthew",
		};
		#endregion

		private static readonly Random rand = new Random();

		public static string GenerateName()
		{
			return firstNames[rand.Next(firstNames.Length)] + " " + lastNames[rand.Next(lastNames.Length)];
		}

		public string Name { get; set; }

		public decimal Amount { get; set; }
	}
	enum SupplierType
	{
 		Credit = 1,
		Debet = 2,
		CreditDebet = 3
	}
}
