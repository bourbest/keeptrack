using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    public class BaseDomainException : Exception
    {
        public BaseDomainException(string entityName, object id, IEnumerable<string> errors = null) : 
            base (GetMessage(entityName, id, errors))
        {
            this.EntityName = entityName;
            this.Id = id.ToString();
            if (errors != null)
            {
                Errors = new List<string>(errors);
            }

            
        }

        public BaseDomainException(string entityName, string message) :
        base(string.Format("Error with Entity {0} : '{1}'", entityName, message))
        {
            this.EntityName = entityName;
            var errs = new List<string>();
            errs.Add(message);
            Errors = errs;
            
        }

        private static string GetMessage(string entityName, object id, IEnumerable<string> errors)
        {
            string ret = string.Format("Error with Entity {0} with id '{1}'", entityName, id.ToString());
            if (errors != null)
            {
                ret += string.Join(";\n\r", errors);
            }
            return ret;
        }

        public string EntityName { get; protected set; }
        public string Id { get; protected set; }
        public IEnumerable<string> Errors { get; protected set; }
    }
}
