using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankSystem
{
	public static class JsonHelpers
	{
		public static Dictionary<string,string> GetJsonDictionary(this string json)
		{
			return (new System.Web.Script.Serialization.JavaScriptSerializer()).Deserialize<Dictionary<string,string>>(json);
		}

		public static string GetJsonAttribute(this string json, string attribute)
		{
			Dictionary<string, string> dict = json.GetJsonDictionary();
			if (dict.ContainsKey(attribute))
			{
				return dict[attribute];
			}
			else
			{
				throw new ArgumentOutOfRangeException("Attribute was not found");
			}
		}
	}
}
