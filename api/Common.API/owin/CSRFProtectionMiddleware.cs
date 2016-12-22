using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Configuration;

namespace Common.API.OWin
{
    public class CSRFProtectionMiddleware : OwinMiddleware   
    {
        public static string CSRFTokenTokenName { get { return _cookieName; } }
        private static string _cookieName = string.Empty;

        public CSRFProtectionMiddleware(OwinMiddleware next)
            : base(next)
        {
            CSRFProtectionConfigurationSection csrfConfig = (CSRFProtectionConfigurationSection )ConfigurationManager.GetSection("Web.CSRFProtection");
            _cookieName = csrfConfig.CookieName;
        }

        protected string GenerateCsrfToken()
        {
            return Guid.NewGuid().ToString();
        }

        protected bool IsExceptionPath(string path)
        {
            bool isException = false;
            path = path.ToLower();
            CSRFProtectionConfigurationSection csrfConfig = (CSRFProtectionConfigurationSection)ConfigurationManager.GetSection("Web.CSRFProtection");

            foreach(CSRFExceptionPathElement el in csrfConfig.PathExceptions)
            {
                if (el.StartingWith)
                    isException = path.StartsWith(el.Path);
                else
                    isException = path == el.Path;

                if (isException)
                    break;
            }
                
            return isException;
        }

        public async override Task Invoke(IOwinContext owinContext)
        {
            var environment = owinContext.Environment;
            var requestHeaders = (IDictionary<string, string[]>)environment["owin.RequestHeaders"];
            
            if (owinContext.Request.Path.HasValue &&
                owinContext.Request.Path.Value == "/csrftoken" && 
                owinContext.Request.Method == "GET")
            {
                
                if(owinContext.Request.User != null && owinContext.Request.User.Identity != null && owinContext.Request.User.Identity.IsAuthenticated)
                {
                    string cookiePath = "/";
                    string scopedCookieName = _cookieName;

                    var nameInRequest = requestHeaders.Where(kv => kv.Key.ToUpper() == "X-COOKIE-NAME").FirstOrDefault();
                    if (nameInRequest.Value != null && nameInRequest.Value.Length > 0)
                    {
                        scopedCookieName = nameInRequest.Value.FirstOrDefault();
                    }

                    //owinContext.Request.Headers.FirstOrDefault()
                    string token = GenerateCsrfToken();
                    environment["owin.ResponseStatusCode"] = 200;
                    CookieOptions options = new CookieOptions();
                    options.HttpOnly = true;
                    options.Path = cookiePath;
                    options.Expires = DateTime.Now.AddHours(8);
                    owinContext.Response.Cookies.Append(scopedCookieName, token, options);
                    owinContext.Response.Headers.Append("content-type", "application/json");
                    owinContext.Response.Write(string.Format("{{ \"token\": \"{0}\" }}", token));
                    return;
                }
                else
                {
                    environment["owin.ResponseStatusCode"] = 401;
                    owinContext.Response.ReasonPhrase = "Not authenticated";
                    return;
                }
            }
            // ne check pas les fonctions idempotentes ou lorsque le user n'est pas authentifié
            else if (owinContext.Request.Method == "GET" || 
                owinContext.Request.Method == "OPTIONS" ||
                owinContext.Request.Method == "HEAD" ||
                (owinContext.Request.Path.HasValue && IsExceptionPath(owinContext.Request.Path.Value)))
            {
                await this.Next.Invoke(owinContext);
            }
            else if (requestHeaders.ContainsKey("Authorization") && !requestHeaders.ContainsKey("X-CSRF-Token"))
            {
                await this.Next.Invoke(owinContext);
            }
            else
            {   // veut modifier l'état d'une ressource, doit avoir le token
                string authCookie = "";
                string portalCSRFCookie = "";
                string csrfToken = "";

                // obtient le cookie
                if (owinContext.Request.Cookies.Count() > 0 &&
                    string.IsNullOrWhiteSpace(owinContext.Request.Cookies[_cookieName]) == false)
                {
                    authCookie = owinContext.Request.Cookies[_cookieName];
                }
                
                // obtient le token dans le header  
                var header = requestHeaders.Where(kv => kv.Key.ToUpper() == "X-CSRF-TOKEN").FirstOrDefault();
                if (header.Value != null && header.Value.Length > 0)
                {
                    csrfToken = header.Value[0];
                }

                // compare le cookie et le header pour s'assurer qu'ils sont identiques
                var valid = (!string.IsNullOrEmpty(authCookie) && authCookie == csrfToken);

                if (!valid)
                {
                    environment["owin.ResponseStatusCode"] = 401;
                    owinContext.Response.ReasonPhrase = "CSRFToken missing or not matching";
                    return;
                }

                await this.Next.Invoke(owinContext);
            }
        }
    }

    public static class CSRFProtectionExtension
    {
        /// <summary>
        /// Active la vérification du token CSRFToken dans le header des méthodes non idempotentes
        /// </summary>
        /// <returns></returns>
        public static IAppBuilder UseCsrfProtection(this IAppBuilder app)
        {
            app.Use(typeof(CSRFProtectionMiddleware));
            return app;
        }
    }

}
