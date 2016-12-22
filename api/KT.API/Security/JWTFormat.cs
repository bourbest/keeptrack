using System;
using System.Configuration;
using System.IdentityModel.Tokens;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Thinktecture.IdentityModel.Tokens;
using System.Security.Claims;
using System.ServiceModel.Security.Tokens;

namespace KT.API.Security
{
    public class JWTFormat : ISecureDataFormat<AuthenticationTicket>
    {
        private readonly string _issuer = string.Empty;
        private readonly string _audienceId = string.Empty;
        private readonly string _symmetricKeyAsBase64 = string.Empty;

        public JWTFormat(string issuer, string audienceId, string symmetricKeyAsBase64)
        {
            _issuer = issuer;
            _audienceId = audienceId;
            _symmetricKeyAsBase64 = symmetricKeyAsBase64;
        }

        public string Protect(AuthenticationTicket data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("data");
            }

            var keyByteArray = TextEncodings.Base64Url.Decode(_symmetricKeyAsBase64);

            var signingKey = new HmacSigningCredentials(keyByteArray);

            var issued = data.Properties.IssuedUtc;

            var expires = data.Properties.ExpiresUtc;

            
            var token = new JwtSecurityToken(_issuer, _audienceId, data.Identity.Claims,
                                                issued.Value.UtcDateTime, expires.Value.UtcDateTime,
                                                signingKey);

            var handler = new JwtSecurityTokenHandler();

            var jwt = handler.WriteToken(token);

            return jwt;
        }

        public AuthenticationTicket Unprotect(string protectedText)
        {

            if (string.IsNullOrWhiteSpace(protectedText))
            {
                throw new ArgumentNullException("protectedText");
            }

            var keyByteArray = TextEncodings.Base64Url.Decode(_symmetricKeyAsBase64);

            var handler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters()
            {
                IssuerSigningToken = new BinarySecretSecurityToken(keyByteArray),
                ValidAudience = _audienceId,
                ValidIssuer = _issuer,
                ValidateLifetime = true,
                ValidateAudience= true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true
            };

            try
            {
                SecurityToken validatedToken;
                var principal = handler.ValidateToken(protectedText, validationParameters, out validatedToken);

                var ticket = new AuthenticationTicket((ClaimsIdentity)principal.Identity, new AuthenticationProperties()
                {
                    AllowRefresh = true,
                    IssuedUtc = DateTime.SpecifyKind(validatedToken.ValidFrom, DateTimeKind.Utc),
                    ExpiresUtc = DateTime.SpecifyKind(validatedToken.ValidTo, DateTimeKind.Utc),
                    IsPersistent = true
                });

                return ticket;

            }
            catch
            {
                return null;
            }
        }
    }
}