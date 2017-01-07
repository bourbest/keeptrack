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
using KT.API.DTO;
using Common.API.CSRF;

using Microsoft.Owin;
using KT.Domain;
using KT.Data.Models;

namespace KT.API.Controllers
{
    [RoutePrefix("session")]
    [RequireHttps]
    public class SessionController : ApiController
    {
        IKTUnitOfWork _uow;

        private static JWTFormat _jwt;
        private static string _authCookieName;
        private static bool _secureCookies;

        private static AuthProvider _authProvider = new AuthProvider();

        static SessionController()
        {
            string _issuer = ConfigurationManager.AppSettings["as:Issuer"];
            string _audienceId = ConfigurationManager.AppSettings["as:AudienceId"];
            string _symmetricKeyAsBase64 = ConfigurationManager.AppSettings["as:AudienceSecret"];

            _jwt = new JWTFormat(_issuer, _audienceId, _symmetricKeyAsBase64);

            _authCookieName = ConfigurationManager.AppSettings["KT:CookieName"];

            _secureCookies = bool.Parse(ConfigurationManager.AppSettings["KT:CookieSecureOnly"]);
        }

        public SessionController(IKTUnitOfWork uow) { _uow = uow; }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Login()
        {
            IHttpActionResult res = null;
            var msg = await Request.Content.ReadAsFormDataAsync();
            LoginData loginForm = new LoginData(msg);

            if (!_authProvider.isValidRequest(loginForm))
                res = BadRequest();
            else
            {
                KTDomainContext ctx = new KTDomainContext();
                UserIdentityService svc = new UserIdentityService(ctx);

                UserIdentity identity = await svc.AuthenticateWithPassword(loginForm.Username, loginForm.Password);

                SessionInfo session = new SessionInfo();
                if (identity != null)
                { 
                    IOwinContext context = HttpContext.Current.GetOwinContext();
                    AuthenticationTicket ticket = await _authProvider.GrantResourceOwnerCredentials(context, identity);

                    session.CsrfToken = CSRFService.SetCsrfToken();

                    HttpCookie cookie = CreateAuthCookie(ticket);
                    session.Ticket = cookie.Value;
                    res = Ok(session);
                }
                else
                {
                    session.Error = "Code usager ou mot de passe invalide";
                    res = Ok(session);
                }
            }

            return res;
        }

        [HttpDelete]
        [Authorize]
        [Route("")]
        public async Task<IHttpActionResult> Logout()
        {
            var msg = await Request.Content.ReadAsFormDataAsync();

            IOwinContext owinContext = HttpContext.Current.GetOwinContext();
            _authProvider.Logout(owinContext);
            FlushAuthCookie(owinContext);
            CSRFService.ClearCsrfToken();
            return ResponseMessage(new HttpResponseMessage(System.Net.HttpStatusCode.NoContent));
        }

        private void FlushAuthCookie(IOwinContext owinContext)
        {
            owinContext.Response.Cookies.Delete(_authCookieName);
        }

        private HttpCookie CreateAuthCookie(AuthenticationTicket ticket)
        {
            string cookieValue = _jwt.Protect(ticket);
            HttpCookie cookie = new HttpCookie(_authCookieName); 
            cookie.Value = cookieValue;
            cookie.Domain = HttpContext.Current.Request.Url.Host;
            cookie.Expires = DateTime.Today.AddDays(1); // this creates a session cookie
            cookie.Secure = _secureCookies;
            cookie.HttpOnly = false;

            HttpContext.Current.Response.AppendCookie(cookie);

            return cookie;
        }

    }
}
