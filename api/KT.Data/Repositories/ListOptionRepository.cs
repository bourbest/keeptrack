using System;
using KT.Data.Models;
using Common.Data.MongoDB;

namespace KT.Data.Repositories
{
    public class ListOptionRepository : MongoDBRepository<string, ListOption>
    {
        public ListOptionRepository(MongoDBContext context) : base(context, context.Collection<ListOption>())
        {
        }
    }
}
