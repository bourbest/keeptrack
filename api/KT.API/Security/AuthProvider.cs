using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Configuration;
using System.Security.Principal;

using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.AspNet.Identity;

using KT.Domain;
using KT.Data.Models;




namespace KT.API.Security
{
    public class AuthProvider
    {
        private static string _authenticationType = ConfigurationManager.AppSettings["as:AuthenticationType"];
        private static bool _supportPasswordGrant = false;

        static AuthProvider()
        {
            _supportPasswordGrant = ConfigurationManager.AppSettings["KT:AllowOAuth"].ToLower() == bool.TrueString.ToLower();
        }
        public AuthProvider()
        {
        }

        public bool isValidRequest(LoginData loginForm)
        {
            bool isValid = false;
            if (loginForm.GrantType == "password")
            {
                isValid = _supportPasswordGrant &&
                          (!string.IsNullOrEmpty(loginForm.Username) && !string.IsNullOrEmpty(loginForm.Password));
            }

            return isValid;
        }

        public void Logout(IOwinContext context)
        {
            context.Authentication.SignOut();
        }

        public async Task<AuthenticationTicket> GrantResourceOwnerCredentials(IOwinContext context, UserIdentity identity)
        {
            AuthenticationTicket ticket = null;

            KTDomainContext ctx = new KTDomainContext();
            UserManager<UserIdentity> userManager = new UserManager<UserIdentity>(ctx.Uow.UserIdentities);
            ClaimsIdentity oAuthIdentity = await userManager.CreateIdentityAsync(identity, _authenticationType);

            oAuthIdentity.AddClaims(identity.Claims);
            AuthenticationProperties authProperties = new AuthenticationProperties()
            {
                AllowRefresh = true,
                IssuedUtc = DateTime.Now,
                ExpiresUtc = DateTime.SpecifyKind(DateTime.Now.AddHours(8), DateTimeKind.Utc),
                IsPersistent = true
            };

            ticket = new AuthenticationTicket((ClaimsIdentity)oAuthIdentity, authProperties);

            context.Authentication.SignOut(_authenticationType);
            context.Authentication.SignIn(authProperties, (ClaimsIdentity) oAuthIdentity);

            ticket.Properties.IssuedUtc = DateTime.Now;
            ticket.Properties.ExpiresUtc = authProperties.ExpiresUtc;

            return ticket;
        }
    }
}