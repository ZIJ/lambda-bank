using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BankEntities;
using System.Data.Entity;
namespace ConsoleTest
{
	class Program
	{
		static void Main(string[] args)
		{
			/*System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
			message.To.Add("sergehill@gmail.com");
			message.Subject = "This is the Subject line";
			message.From = new System.Net.Mail.MailAddress("thereisnohuman@drs-cd.com", "Lambda Bank Robo");
			message.Body = "This is the message body";
			System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587);
			smtp.UseDefaultCredentials = false;
			smtp.Credentials = new System.Net.NetworkCredential("thereisnohuman@drs-cd.com", "thereisnospoon");
			//smtp.Credentials = new System.Net.NetworkCredential("thereisnohuman@drs-cd.com", "111111");
			//smtp.Credentials = new System.Net.NetworkCredential("ivan_borushko_gmail", "dcGfccrjlt");
			
			smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
			
			smtp.EnableSsl = true;
			smtp.Send(message);*/

			var x = new ExRatesBy.Rates.ExRatesSoapClient();
			var st = x.ExRatesDaily(DateTime.Now);
	
			var tables = st.Tables;
			var x3 = tables[0];

			for (int i = 0; i < x3.Rows.Count; i++)
			{ 
				System.Data.DataRow row = x3.Rows[i];
				Console.WriteLine(row.ItemArray[4]);
			}


				Console.ReadKey();
		}
	}
}
