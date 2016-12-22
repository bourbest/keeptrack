using System;
using System.Linq;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http.Filters;

namespace Common.API
{
    public class RequireHttpsAttribute : AuthorizationFilterAttribute
    {
        static readonly bool RequireSSL = ReadConfigSSLRequired;
        public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            if (!RequireSSL)
                return;

            var request = actionContext.Request;

            if (request.RequestUri.Scheme != Uri.UriSchemeHttps)
            {
                actionContext.Response = request.CreateResponse(HttpStatusCode.NotFound);
                actionContext.Response.Content = new StringContent("SSL required", Encoding.UTF8, "text/html");
            }
        }

        private static bool ReadConfigSSLRequired
        { 
            get
            {
                bool requireHttps = true;
                bool.TryParse(ConfigurationManager.AppSettings["ssl:Required"], out requireHttps);
                return requireHttps;
            }
        }
    }
}