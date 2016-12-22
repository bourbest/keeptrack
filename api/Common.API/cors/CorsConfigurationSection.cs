using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Common.API.Cors
{
    public class CorsConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("allowAnyHeader", DefaultValue = "true", IsRequired = false)]        
        public bool AllowAnyHeader
        {
            get
            {
                return (bool)this["allowAnyHeader"];
            }
            set
            {
                this["allowAnyHeader"] = value;
            }
        }

        [ConfigurationProperty("allowAnyMethod", DefaultValue = "true", IsRequired = false)]
        public bool AllowAnyMethod
        {
            get
            {
                return (bool)this["allowAnyMethod"];
            }
            set
            {
                this["allowAnyMethod"] = value;
            }
        }

        [ConfigurationProperty("allowAnyOrigin", DefaultValue = "false", IsRequired = false)]
        public bool AllowAnyOrigin
        {
            get
            {
                return (bool)this["allowAnyOrigin"];
            }
            set
            {
                this["allowAnyOrigin"] = value;
            }
        }

        [ConfigurationProperty("supportCredentials", DefaultValue = "true", IsRequired = false)]
        public bool SupportCredentials
        {
            get
            {
                return (bool)this["supportCredentials"];
            }
            set
            {
                this["supportCredentials"] = value;
            }
        }

        // Create a "font" element.
        [ConfigurationCollection(typeof(OriginCollection))] 
        [ConfigurationProperty("origins")]
        public OriginCollection Origins
        {
            get
            {
                OriginCollection origins = (OriginCollection)this["origins"];
                return origins;
            }
            set
            {
                this["origins"] = value;
            }
        }

    }
}
