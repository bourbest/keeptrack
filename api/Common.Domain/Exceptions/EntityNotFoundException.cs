using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
  public class EntityNotFoundException : BaseDomainException
  {
    public EntityNotFoundException(string entityName, object id) 
        : base(entityName, id, new string[] { "It does not exists" } )
    {
      EntityName = entityName;
      Id = id.ToString();
    }
  }
}
