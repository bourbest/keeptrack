using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Common.API.CSRF
{
    public class CSRFService
    {
        private static CSRFProtectionConfigurationSection _config = (CSRFProtectionConfigurationSection)ConfigurationManager.GetSection("Web.CSRFProtection");
        public static string GenerateCsrfToken()
        {
            return Guid.NewGuid().ToString();
        }

        public static string SetCsrfToken()
        {
            HttpCookie cookie = new HttpCookie(_config.CookieName);
            cookie.Value = GenerateCsrfToken();
            cookie.Domain = HttpContext.Current.Request.Url.Host;
            cookie.Secure = false;
            cookie.HttpOnly = true;
            cookie.Path = "/";

            HttpContext.Current.Response.AppendCookie(cookie);

            return cookie.Value;
        }
        
        public static string ReadCsrfCookie(IOwinContext owinContext)
        {
            string ret = null;
            try
            {
                ret = owinContext.Request.Cookies[_config.CookieName];
            }
            catch (Exception)
            { }

            return ret;
        }
    

        public static void ClearCsrfToken()
        {
            HttpCookie cookie = new HttpCookie(_config.CookieName);
            cookie.Value = "";
            cookie.Domain = HttpContext.Current.Request.Url.Host;
            cookie.Secure = false;
            cookie.HttpOnly = true;
            cookie.Path = "/";
            cookie.Expires = DateTime.Now;

            HttpContext.Current.Response.SetCookie(cookie);
        }


    }
}
