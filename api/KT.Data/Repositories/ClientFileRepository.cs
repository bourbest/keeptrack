using System;
using KT.Data.Models;

using Common.Data;
using Common.Data.MongoDB;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Threading.Tasks;
using System.Collections.Generic;
using Common.Data.MongoDB.MongoOperations;

namespace KT.Data.Repositories
{
    public class ClientFileRepository : MongoDBRepository<Guid, ClientFile>
    {


        public ClientFileRepository(MongoDBContext context) : base(context, context.Collection<ClientFile>())
        {
        }


    }
}
