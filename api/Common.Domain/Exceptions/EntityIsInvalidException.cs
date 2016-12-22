using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    public class EntityIsInvalidException : BaseDomainException
    {
        public EntityIsInvalidException(string entityName, object id, IEnumerable<string> errors)
        : base(entityName, id, errors)
        { }

    }
}
