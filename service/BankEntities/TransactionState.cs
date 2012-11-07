using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public enum TransactionState
	{
		Opened,
		Closed,
		Rollbacked,
	}
}
