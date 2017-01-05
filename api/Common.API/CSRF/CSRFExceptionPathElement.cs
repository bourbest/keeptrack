using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.API.CSRF
{
    public class CSRFExceptionPathElement : ConfigurationElement
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

        [ConfigurationProperty("path", IsRequired = true)]
        //[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
        public string Path
        {
            get
            {
                return (string)this["path"];
            }
            set
            {
                this["path"] = value;
            }
        }

        [ConfigurationProperty("startingWith", IsRequired = false, DefaultValue = "false")]
        //[RegexStringValidator(@"\w+:\/\/[\w.]+\S*")]
        public bool StartingWith
        {
            get
            {
                return (bool)this["startingWith"];
            }
            set
            {
                this["startingWith"] = value;
            }
        }

        #endregion

        #region - Constructors -

        public CSRFExceptionPathElement(string name, string path, bool startingWith = false)
        {
            this.Name = name;
            this.Path = path;
            this.StartingWith = startingWith;
        }

        public CSRFExceptionPathElement()
        {

        }

        #endregion
    }
}
