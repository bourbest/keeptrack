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
    public class MEClientAuthProvider
    {
        private static string _authenticationType = ConfigurationManager.AppSettings["as:AuthenticationType"];
        private static bool _supportPasswordGrant = false;

        static MEClientAuthProvider()
        {
            _supportPasswordGrant = ConfigurationManager.AppSettings["ME:AllowOAuth"].ToLower() == bool.TrueString.ToLower();
        }
        public MEClientAuthProvider()
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

        public async Task<AuthenticationTicket> GrantResourceOwnerCredentials(IOwinContext context, LoginData loginForm)
        {
            AuthenticationTicket ticket = null;

            if (isValidRequest(loginForm))
            {
                MEDomainContext ctx = new MEDomainContext();
                UserIdentityService svc = new UserIdentityService(ctx);

                UserIdentity identity = await svc.AuthenticateWithPassword(loginForm.Username, loginForm.Password);

                if (identity != null)
                {
                    UserManager<UserIdentity> userManager = new UserManager<UserIdentity>(ctx.Uow.UserIdentities);
                    IIdentity oAuthIdentity = await userManager.CreateIdentityAsync(identity, _authenticationType);

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
                }
            }

            return ticket;
        }
    }
}