using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using BankEntities;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel.Web;
using System.Data.Entity;
using System.Configuration;
using System.Net;
using System.Threading;
namespace BankService
{
	/*
	public class BankDaemon
	{

		private BankDatabase db = null;

		public BankDaemon()
		{
			
			

		}

		
		public BankDatabase Database
		{
			get
			{
				return db;
			}
		}

		public void StartProcessing()
		{
			while (true)
			{
				DateTime now = DateTime.Now;
				foreach (CalendarSchedule schedule in db.CalendarSchelules)
				{
					if ((schedule.DayOfMonth == null || schedule.DayOfMonth == now.Day) &&
						(schedule.DayOfWeek == null || schedule.DayOfWeek % 7 == (int)now.DayOfWeek) &&
						(schedule.Hour == null || schedule.Hour == now.Hour) &&
						(schedule.Month == null || schedule.Month == now.Month)
						)
					{
						//run
					}
				}
				foreach (SpanSchedule schedule in db.SpanSchedules)
				{
					TimeSpan span = DateTime.Now - schedule.LastTime;
					int repeatCount = (int)Math.Floor(span.TotalMinutes / schedule.Span.TotalMinutes);
					for (int i = 0; i < repeatCount; i++)
					{
						//run
						schedule.LastTime += schedule.Span;
					}
				}
				Thread.Sleep(1000 * 60 * 60);
			}
		}
	}
	 * */
}