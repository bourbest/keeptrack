using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Common.API.CSRF
{
    public class CSRFProtectionConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("cookieName", DefaultValue = "CSRF-Cookie", IsRequired = false)]        
        public string CookieName
        {
            get
            {
                return (string) this["cookieName"];
            }
            set
            {
                this["cookieName"] = value;
            }
        }

        // Create a "font" element.
        [ConfigurationCollection(typeof(CSRFExceptionPathCollection))] 
        [ConfigurationProperty("PathExceptions")]
        public CSRFExceptionPathCollection PathExceptions
        {
            get
            {
                CSRFExceptionPathCollection exceptions = (CSRFExceptionPathCollection)this["PathExceptions"];
                return exceptions;
            }
            set
            {
                this["PathExceptions"] = value;
            }
        }

    }
}
