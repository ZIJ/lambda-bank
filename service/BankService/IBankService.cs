using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.ServiceModel.Channels;
using System.Web.Script.Serialization;
using BankEntities;

namespace BankService
{
	// NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
	[ServiceContract]
	public interface IBankService
	{
		#region Users

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/admin/users/get")]
		Message GetUsers(Guid securityToken, bool joinCards, int? userId);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/admin/users/create")]
		Message CreateUser(Guid securityToken, BankUser user);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/admin/users/update")]
		Message UpdateUser(Guid securityToken, BankUser user);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/admin/users/addinternetbankingrole")]
		Message AddIBUser(Guid securityToken, int id);
		#endregion

		#region Cards
		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/admin/cards/get")]
		Message GetCards(Guid securityToken, int userId);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/admin/cards/create")]
		Message CreateCard(Guid securityToken, int userId, DateTime expirationTime, Currency[] currency, int? accountID2Attach);
		
		//[WebInvoke(Method = "POST",
		//	RequestFormat = WebMessageFormat.Json,
		//	ResponseFormat = WebMessageFormat.Json,
		//	BodyStyle = WebMessageBodyStyle.Wrapped,
		//	UriTemplate = "/admin/card/attach")]
		//Message AttachAccount2Card(Guid securityToken, int accountID, int cardID);
		#endregion

		#region Accounts

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/accounts/create")]
		Message CreateAccount(Guid securityToken, Account account);

		#endregion

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/login")]
		Message Login(string login, string password);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/verifyToken")]
		Message VerifyToken(Guid securityToken);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/logout")]
		Message Logout(Guid securityToken);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/cards/list")]
		Message GetUserCards(Guid securityToken);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/paymentslog")]
		Message GetLog(Guid securityToken, byte[] accountNumber, DateTime start, DateTime end);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/payment/accountdetails")]
		Message PayAccDetails(Guid securityToken, string paymentInfo);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/payment/preinfo")]
		Message PrePaymentInfo(Guid securityToken, string paymentInfo);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/payments/proceed")]
		Message Payment(Guid securityToken, string paymentInfo);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/mypayments/last")]
		Message GetLastPayments(Guid securityToken);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/mypayments/saved")]
		Message GetSavedPayments(Guid securityToken);

		[WebInvoke(Method = "PUT",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/mypayments/save")]
		Message SavePayments(Guid securityToken, string paymentInfo);
		
		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/get")]
		Message GetSchedules(Guid securityToken);

		[WebInvoke(Method = "PUT",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/calendar")]
		Message CreateCalendarSchedule(Guid securityToken, string paymentInfo);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/calendar")]
		Message UpdateCalendarSchedule(Guid securityToken, int id, string paymentInfo);

		[WebInvoke(Method = "DELETE",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/calendar")]
		Message DeleteCalendarSchedule(Guid securityToken, int id);

		[WebInvoke(Method = "PUT",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/span")]
		Message CreateSpanSchedule(Guid securityToken, string paymentInfo);

		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/span")]
		Message UpdateSpanSchedule(Guid securityToken, int id, string paymentInfo);

		[WebInvoke(Method = "DELETE",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.Wrapped,
			UriTemplate = "/user/schedules/span")]
		Message DeleteSpanSchedule(Guid securityToken, int id);
	}
}
