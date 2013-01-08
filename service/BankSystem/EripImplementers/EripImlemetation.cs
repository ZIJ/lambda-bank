using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;

namespace BankSystem.EripImplementers
{
	class EripImlemetation: IERIP
	{
		private Dictionary<EripPaymentType, ISupplier> operators = new Dictionary<EripPaymentType, ISupplier>();

		public EripImlemetation()
		{
			operators.Add(EripPaymentType.Velcom, new DefaultSupplier() 
			{ 
				Type = SupplierType.CreditDebet, 
				MoneyBase = 20000, 
				Requisite = new Prerequisite() 
				{ 
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"), 
					AccountNumber = "4359830000001", 
					Currency = Currency.BYR 
				} 
			});

			operators.Add(EripPaymentType.Mts, new DefaultSupplier()
			{
				Type = SupplierType.CreditDebet,
				MoneyBase = 20000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000002",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.Life, new DefaultSupplier()
			{
				Type = SupplierType.CreditDebet,
				MoneyBase = 20000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000003",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.Diallog, new DefaultSupplier()
			{
				Type = SupplierType.CreditDebet,
				MoneyBase = 20000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000004",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.BeltelecomMGTS, new DefaultSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 100000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000005",
					Currency = Currency.BYR
				}
			});


			operators.Add(EripPaymentType.ElectroService, new ServiceSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 250,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000006",
					Currency = Currency.BYR,
					Rate = 323,
				}
			});

			operators.Add(EripPaymentType.AquaService, new ServiceSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 20,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000007",
					Currency = Currency.BYR,
					Rate = 6550,
				}
			});

			operators.Add(EripPaymentType.GasService, new ServiceSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 5,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000008",
					Currency = Currency.BYR,
					Rate = 933,
				}
			});

			operators.Add(EripPaymentType.UtilityService, new DefaultSupplier()
			{
				Type = SupplierType.CreditDebet,
				MoneyBase = 500000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000009",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.BusinessNetwork, new DefaultSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 100000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000010",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.AtlantTelecom, new DefaultSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 100000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000011",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.AdslBy, new DefaultSupplier()
			{
				Type = SupplierType.Debet,
				MoneyBase = 100000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000012",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.AirTikets, new DefaultSupplier()
			{
				Type = SupplierType.Credit,
				MoneyBase = 1000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000013",
					Currency = Currency.EUR
				}
			});

			operators.Add(EripPaymentType.RailwayTikets, new DefaultSupplier()
			{
				Type = SupplierType.Credit,
				MoneyBase = 100000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000014",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.CosmosTv, new DefaultSupplier()
			{
				Type = SupplierType.CreditDebet,
				MoneyBase = 50000,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000015",
					Currency = Currency.BYR
				}
			});

			operators.Add(EripPaymentType.PoliceFine, new DefaultSupplier()
			{
				Type = SupplierType.Credit,
				MoneyBase = 50,
				Requisite = new Prerequisite()
				{
					BankGuid = new Guid("{3EDDF226-9692-4EF6-8E46-C36373E455FA}"),
					AccountNumber = "4359830000016",
					Currency = Currency.EUR
				}
			});
		}

		public object GetPaymentInfo(EripPaymentType type, string jsonPayment)
		{
			return operators[type].GetPaymentInfo(jsonPayment);
		}

		public Prerequisite GetPrerequisites(EripPaymentType type)
		{
			return operators[type].Requisite;
		}

		public object SendPayment(EripPaymentType type, string jsonPayment, decimal amount)
		{
			return operators[type].SendPayment(jsonPayment, amount);
		}
	}
}
