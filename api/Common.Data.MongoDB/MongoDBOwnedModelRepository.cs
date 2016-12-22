using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Common.Data.MongoDB.MongoOperations;

namespace Common.Data.MongoDB
{
    public abstract class MongoDBOwnedModelRepository<TKey, TModel, TOwnerId> : MongoDBRepository<TKey, TModel>, 
                                IOwnedModelRepository<TKey, TModel, TOwnerId> where TModel : IOwnedModel<TKey, TOwnerId>
    {
        public MongoDBOwnedModelRepository(MongoDBContext context, IMongoCollection<TModel> collection) : base(context, collection)
        {
        }

        protected FilterDefinitionBuilder<TModel> FilterBuilder
        {
            get
            {
                return Builders<TModel>.Filter;
            }
        }
        public void DeleteForOwner(TKey id, TOwnerId ownerId)
        {
            var filter = FilterBuilder.And(
                    FilterBuilder.Eq("_id", id),
                    FilterBuilder.Eq(m => m.OwnerId, ownerId));

            _context.AddOperation(new DeleteOperation<TKey, TModel>(_collection, filter));
        }

        public void DeleteManyForOwner(IEnumerable<TKey> ids, TOwnerId ownerId)
        {
            var filter = FilterBuilder.And(
                    FilterBuilder.In("_id", ids),
                    FilterBuilder.Eq(m => m.OwnerId, ownerId));

            _context.AddOperation(new DeleteOperation<TKey, TModel>(_collection, filter));
        }

        public Task<TModel> FindByIdForOwnerAsync(TKey id, TOwnerId ownerId)
        {
            var filter = FilterBuilder.And(
                    FilterBuilder.Eq("_id", id),
                    FilterBuilder.Eq(m => m.OwnerId, ownerId));
            return _collection.Find(filter).FirstOrDefaultAsync();
        }

        public Task<List<TModel>> FindAllForOwnerAsync(TOwnerId ownerId)
        {
            var filter = FilterBuilder.Eq(m => m.OwnerId, ownerId);
            return _collection.Find(filter).ToListAsync();
        }

        public void UpdateForOwner(TModel model, TOwnerId ownerId)
        {
            var filter = FilterBuilder.Eq(m => m.OwnerId, ownerId);
            _context.AddOperation(new ReplaceOperation<TKey, TModel>(_collection, model,  false,  filter));
        }

        public void UpsertForOwner(TModel model, TOwnerId ownerId)
        {
            var filter = FilterBuilder.Eq(m => m.OwnerId, ownerId);
            _context.AddOperation(new ReplaceOperation<TKey, TModel>(_collection, model, true, filter));
        }

        public Task<List<TModel>> FindByIdsForOwnerAsync(IEnumerable<TKey> ids, TOwnerId ownerId)
        {
            var filter = FilterBuilder.And(
                    FilterBuilder.In("_id", ids),
                    FilterBuilder.Eq(m => m.OwnerId, ownerId));
            return _collection.Find(filter).ToListAsync();

        }
    }
}