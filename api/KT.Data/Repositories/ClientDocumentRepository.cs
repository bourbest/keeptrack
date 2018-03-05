using System;
using KT.Data.Models;
using Common.Data.MongoDB;
using System.Threading.Tasks;
using System.Collections.Generic;
using MongoDB.Driver;

namespace KT.Data.Repositories
{
    public class ClientDocumentRepository : MongoDBRepository<Guid, ClientDocument>
    {
        public ClientDocumentRepository(MongoDBContext context) : base(context, context.Collection<ClientDocument>())
        {
        }

        protected ProjectionDefinition<ClientDocument> GetListProjection()
        {
            ProjectionDefinition<ClientDocument> projection = null;
            ProjectionDefinitionBuilder<ClientDocument> builder = Builders<ClientDocument>.Projection;

            //Return only the necessary properties for search result
            projection = builder.Exclude(i => i.Values);
            return projection;
        }

        public Task<List<ClientDocument>> FindByClientId(Guid clientId)
        {
            var filter = _builder.Eq(e=> e.ClientId, clientId);
            var projection = GetListProjection();
            return _collection.Find(filter)
                .Project<ClientDocument>(projection)
                .ToListAsync();
        }
    }
}
