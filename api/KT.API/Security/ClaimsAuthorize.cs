using KT.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace KT.API
{
    public class ClaimsAuthorize : AuthorizeAttribute
    {
        public string[] Permissions { get; set; }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            ClaimsIdentity claimsIdentity;
            var httpContext = HttpContext.Current;

            if (!(httpContext.User.Identity is ClaimsIdentity))
                return false;

            claimsIdentity = httpContext.User.Identity as ClaimsIdentity;
            UserIdentity identity = new UserIdentity(claimsIdentity);
            
            if (!identity.HasAnyPermission(Permissions))
                return false;

            return base.IsAuthorized(actionContext);
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            base.HandleUnauthorizedRequest(actionContext);
            actionContext.Response.StatusCode = System.Net.HttpStatusCode.Forbidden;
            actionContext.Response.ReasonPhrase = "Forbidden";
        }
    }
}