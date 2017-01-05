using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Configuration;

namespace Common.API.CSRF
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
                    CSRFService.SetCsrfToken();
                    environment["owin.ResponseStatusCode"] = 200;
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
                string csrfToken = "";

                // obtient le cookie
                authCookie = CSRFService.ReadCsrfCookie(owinContext);
                
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
