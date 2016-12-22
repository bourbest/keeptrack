using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace KT.API.Security
{
    public class LoginData
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string GrantType { get; set; }
        public string Token { get; set; }

        public LoginData(NameValueCollection loginForm = null)
        {
            if (loginForm != null)
                LoadLoginForm(loginForm);
        }

        public void LoadLoginForm(NameValueCollection loginForm)
        {
            foreach(string key in loginForm)
            {
                switch(key.ToLower())
                {
                    case "username":
                        Username = loginForm[key];
                        break;

                    case "password":
                        Password = loginForm[key];
                        break;

                    case "grant_type":
                        GrantType = loginForm[key];
                        break;

                    case "token":
                        Token = loginForm[key];
                        break;
                }
            }
        }
       
    }
}