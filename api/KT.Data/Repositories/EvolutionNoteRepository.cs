using System;
using KT.Data.Models;
using Common.Data.MongoDB;
using System.Threading.Tasks;
using System.Collections.Generic;
using MongoDB.Driver;

namespace KT.Data.Repositories
{
    public class EvolutionNoteRepository : MongoDBRepository<Guid, EvolutionNote>
    {
        public EvolutionNoteRepository(MongoDBContext context) : base(context, context.Collection<EvolutionNote>())
        {
        }

        public Task<List<EvolutionNote>> FindByClientId(Guid clientId)
        {
            var filter = _builder.Eq(e=> e.ClientId, clientId);
            return _collection.Find(filter)
                .ToListAsync();
        }
    }
}
