using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.API.Cors
{
    public class OriginElement : ConfigurationElement
    {
        #region - Public Properties -

        [ConfigurationProperty("name", IsRequired = true, IsKey = true, DefaultValue="all")]
        public string Name
        {
            get
            {
                return (string)this["name"];
            }
            set
            {
                this["name"] = value;
            }
        }

        [ConfigurationProperty("value", IsRequired = true, DefaultValue="*")]
        //[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
        public string Value
        {
            get
            {
                return (string)this["value"];
            }
            set
            {
                this["value"] = value;
            }
        }

        #endregion

        #region - Constructors -

        public OriginElement(string name, string value)
        {
            this.Name = name;
            this.Value = value;
        }

        public OriginElement()
        {

        }

        #endregion
    }
}
