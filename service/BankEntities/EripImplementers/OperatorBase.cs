using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities.EripImplementers
{
	abstract class OperatorBase<T>
	{
		public virtual Prerequisite Requisite { get; set; }

		Dictionary<string, T> accounts = new Dictionary<string, T>();

		protected abstract void Generate(string id);

		public abstract object GetAccountInfo(string payment);

		public abstract object ApplyPayment(string payment, decimal amount);
	}
}
