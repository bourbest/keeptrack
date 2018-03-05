using System;
using KT.Data.Models;
using Common.Data.MongoDB;

namespace KT.Data.Repositories
{
    public class ClientFileRepository : MongoDBRepository<Guid, ClientFile>
    {
        public ClientFileRepository(MongoDBContext context) : base(context, context.Collection<ClientFile>())
        {
        }
    }
}
