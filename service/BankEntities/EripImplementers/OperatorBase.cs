using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities.EripImplementers
{
	abstract class OperatorBase<T>
	{
		public Prerequisite Requisite { get; set; }

		Dictionary<string, T> accounts = new Dictionary<string, T>();

		protected abstract void Generate(string id);
	}

}
