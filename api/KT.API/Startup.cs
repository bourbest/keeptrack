using Elmah.Contrib.WebApi;
using FluentValidation.WebApi;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;
using Ninject.Web.Common.OwinHost;
using Ninject.Web.WebApi.OwinHost;
using Owin;
using Owin.WebSocket.Extensions;
using KT.Data;
using KT.API;
using KT.API.Security;
using KT.Data.Models;
using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Routing;
using Common.API.Cors;
using Common.API.CSRF;
using Newtonsoft.Json.Serialization;

[assembly: OwinStartup(typeof(Startup))]

namespace KT.API
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();

            //config.MessageHandlers.Add(new CorsDelegatingHandler());

            //ConfigureAuth(app);
            string issuer = ConfigurationManager.AppSettings["as:Issuer"];
            string authType = ConfigurationManager.AppSettings["KT:AuthType"];
            string audienceId = ConfigurationManager.AppSettings["as:AudienceId"];
            string symmetricKeyAsBase64 = ConfigurationManager.AppSettings["as:AudienceSecret"];

            ConfigureOwinApplications(app);

            config.SuppressDefaultHostAuthentication();

            ConfigureCookieTokenConsumption(app, config, issuer, audienceId, symmetricKeyAsBase64);

            ConfigureOAuthTokenConsumption(app, config, issuer, audienceId, symmetricKeyAsBase64);

            app.UseCsrfProtection();

            //ELMAH configuration
            //Register exception handler
            config.Services.Replace(typeof(IExceptionLogger), new ElmahExceptionLogger());

            //Formatter configuration
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            //ValidationResultExtension configuration
            FluentValidationModelValidatorProvider.Configure(config);

            //Web api route configuration (AttributeRouting instead of default routing system)
            config.MapHttpAttributeRoutes(new CustomDirectRouteProvider());

            // Ignore ELMAH routes
            RouteTable.Routes.Ignore("{resource}.axd/{*pathInfo}");

            //Ninject configuration
            app.UseNinjectMiddleware(() => NinjectConfig.CreateKernel.Value);
            app.UseNinjectWebApi(config);

        }

        private CorsOptions GetCorsOptions()
        {
            // Try and load allowed origins from web.config
            // If none are specified we'll allow all origins
            CorsConfigurationSection corsConfig = (CorsConfigurationSection)ConfigurationManager.GetSection("Web.Cors");
            var _policy = new CorsPolicy();

            if (corsConfig != null)
            {
                _policy.AllowAnyHeader = corsConfig.AllowAnyHeader;
                _policy.AllowAnyMethod = corsConfig.AllowAnyMethod;
                _policy.AllowAnyOrigin = corsConfig.AllowAnyOrigin;
                _policy.SupportsCredentials = corsConfig.SupportCredentials;

                foreach (OriginElement origin in corsConfig.Origins)
                {
                    _policy.Origins.Add(origin.Value);
                }
            }
            else
            {
                _policy.AllowAnyOrigin = true;
            }

            var corsOptions = new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context => Task.FromResult(_policy)
                }
            };

            return corsOptions;
        }

        public void ConfigureOwinApplications(IAppBuilder app)
        {
            app.UseCors(GetCorsOptions());
        }

        private static void ConfigureCookieTokenConsumption(IAppBuilder app, HttpConfiguration config, string issuer, string audienceId, string symmetricKeyAsBase64)
        {
            string authenticationType = ConfigurationManager.AppSettings["as:AuthenticationType"];

            config.Filters.Add(new HostAuthenticationFilter(authenticationType));

            var cookieName = ConfigurationManager.AppSettings["KT:CookieName"];
            app.SetDefaultSignInAsAuthenticationType(authenticationType);

            var rootUrl = ConfigurationManager.AppSettings["KT:RootUrl"];
            Uri myUri = new Uri(rootUrl);
            string domain = myUri.Host;

            CookieAuthenticationOptions cookieAuthenticationOptions = new CookieAuthenticationOptions()
            {
                AuthenticationType = authenticationType,
                CookieName = cookieName,
                CookieSecure = CookieSecureOption.Always,
                CookieHttpOnly = false,
                TicketDataFormat = new JWTFormat(issuer, audienceId, symmetricKeyAsBase64),
                CookieDomain = domain
            };

            if ((ConfigurationManager.AppSettings["KT:CookieSecureOnly"].ToLower() == bool.FalseString.ToLower()))
                cookieAuthenticationOptions.CookieSecure = CookieSecureOption.SameAsRequest;

            app.UseCookieAuthentication(cookieAuthenticationOptions);
        }

        private void ConfigureOAuthTokenConsumption(IAppBuilder app, HttpConfiguration config, string issuer, string audienceId, string symmetricKeyAsBase64)
        {
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            byte[] audienceSecret = TextEncodings.Base64Url.Decode(symmetricKeyAsBase64);

            // Api controllers with an [Authorize] attribute will be validated with JWT
            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    //Provider = new QueryStringOAuthBearerProvider(), //Utiliser ce provider si nous devons faire des validations supplémentaire sur le token JWT
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = new[] { audienceId },
                    IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
                    {
                        new SymmetricKeyIssuerSecurityTokenProvider(issuer, audienceSecret)
                    }
                });
        }
    }

}
