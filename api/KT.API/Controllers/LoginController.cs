using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web;
using System;
using System.Configuration;
using Microsoft.Owin.Security;

using Common.API;

using KT.Data;
using KT.API.Security;

namespace KT.API.Controllers
{
    [RoutePrefix("auth")]
    [RequireHttps]
    public class LoginController : ApiController
    {
        IMEUnitOfWork _uow;

        private static JWTFormat _jwt;

        private static MEClientAuthProvider _authProvider = new MEClientAuthProvider();

        static LoginController()
        {
            string _issuer = ConfigurationManager.AppSettings["as:Issuer"];
            string _audienceId = ConfigurationManager.AppSettings["as:AudienceId"];
            string _symmetricKeyAsBase64 = ConfigurationManager.AppSettings["as:AudienceSecret"];

            _jwt = new JWTFormat(_issuer, _audienceId, _symmetricKeyAsBase64);
        }

        public LoginController(IMEUnitOfWork uow) { _uow = uow; }

        [HttpPost, Route("login")]
        public async Task<IHttpActionResult> Login()
        {
            IHttpActionResult res = null;
            var msg = await Request.Content.ReadAsFormDataAsync();
            LoginData loginForm = new LoginData(msg);

            if (!_authProvider.isValidRequest(loginForm))
                res = BadRequest();
            else
            {
                AuthenticationTicket ticket = await _authProvider.GrantResourceOwnerCredentials(HttpContext.Current.GetOwinContext(), loginForm);

                if (ticket != null)
                {
                    HttpCookie cookie = CreateAuthCookie(ticket);
                    AccessToken ret = new AccessToken(cookie.Value);
                    res = Ok(ret);
                }
                else
                    res = Unauthorized();
            }

            return res;
        }

        [HttpPost, Route("logout")]
        [Authorize]
        public async Task<IHttpActionResult> Logout()
        {
            var msg = await Request.Content.ReadAsFormDataAsync();

            _authProvider.Logout(HttpContext.Current.GetOwinContext());
            FlushAuthCookie();
            return ResponseMessage(new HttpResponseMessage(System.Net.HttpStatusCode.NoContent));
        }

        private HttpCookie FlushAuthCookie()
        {
            string cookieValue = "";

            HttpCookie cookie = new HttpCookie(ConfigurationManager.AppSettings["ME:CookieName"]);
            cookie.Value = cookieValue;
            cookie.Domain = HttpContext.Current.Request.Url.Host;
            cookie.Expires = DateTime.Now; 
            cookie.Secure = true;
            cookie.HttpOnly = false;

            HttpContext.Current.Response.SetCookie(cookie);

            return cookie;
        }

        private HttpCookie CreateAuthCookie(AuthenticationTicket ticket)
        {
            string cookieValue = _jwt.Protect(ticket);

            HttpCookie cookie = new HttpCookie(ConfigurationManager.AppSettings["ME:CookieName"]); 
            cookie.Value = cookieValue;
            cookie.Domain = HttpContext.Current.Request.Url.Host;
            cookie.Expires = DateTime.MinValue; // this creates a session cookie
            cookie.Secure = true;
            cookie.HttpOnly = false;

            HttpContext.Current.Response.SetCookie(cookie);

            return cookie;
        }

    }
}
