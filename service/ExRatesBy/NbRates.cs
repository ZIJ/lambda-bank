using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
namespace ExRatesBy
{
	public static class NbRates
	{
		public static Dictionary<string, decimal> GetCurrencies()
		{
			var ratesDataset = new Rates.ExRatesSoapClient().ExRatesDaily(DateTime.Now);
			var table = ratesDataset.Tables[0];
			Dictionary<string, decimal> result = new Dictionary<string, decimal>();
			foreach (DataRow row in table.Rows)
			{
				int count = (int)row[1];
				decimal currency = (decimal)row[2] / count;
				string name = (string)row[4];
				result.Add(name, currency);
			}
			return result;
		}
	}
}
