using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Common.Data.MongoDB.MongoOperations
{
    public class UpdateOperation<TKey, TModel> : IMongoDBWriteOperation where TModel : IModel<TKey>
    {
        private IMongoCollection<TModel> _collection;
        private FilterDefinition<TModel> _filter = null;
        UpdateDefinition<TModel> _updateToPerform;
        private Task<UpdateResult> _task;

        public UpdateOperation(IMongoCollection<TModel> collection,
                                UpdateDefinition<TModel> updateToPerform, 
                                FilterDefinition<TModel> filter)
        {
            _collection = collection;
            _updateToPerform = updateToPerform;
            _filter = filter;
        }


        public Task Execute()
        {
            _task = _collection.UpdateManyAsync(_filter, _updateToPerform);
            return _task;
        }

        public long GetAffectedCount()
        {
            return _task.Result.ModifiedCount;
        }
    }
}
