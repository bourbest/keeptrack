using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KT.API.Security
{
    internal class AccessToken
    {
        public AccessToken(string tokenValue)
        {
            access_token = tokenValue;
            tokenValue = "bearer";
            expires_in = 86399;
            token_type = null;
        }

        public string access_token;
        public string token_type;
        public int expires_in;
    }
}