using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using KT.Data.Models;

namespace KT.API.DTO
{
    public class SessionInfo
    {
        public string CsrfToken { get; set; }
        public string Ticket { get; set; }
        public string Error { get; set; }
    }
}