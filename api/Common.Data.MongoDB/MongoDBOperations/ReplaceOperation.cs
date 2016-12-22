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
    public class ReplaceOperation<TKey, TModel> : IMongoDBWriteOperation where TModel : IModel<TKey>
    {
        private IMongoCollection<TModel> _collection;
        private TModel _doc;
        private bool _isUpsert;
        private FilterDefinition<TModel> _additionnalFilter = null;
        private Task<ReplaceOneResult> _task;


        public ReplaceOperation(IMongoCollection<TModel> collection,
                                TModel doc, 
                                bool insertIfNotExists = false,
                                FilterDefinition<TModel> additionalFilter = null)
        {
            _collection = collection;
            _doc = doc;
            _isUpsert = insertIfNotExists;
            _additionnalFilter = additionalFilter;
        }

        public Task Execute()
        {
            UpdateOptions options = null;
            var filter = Builders<TModel>.Filter.Eq("_id", _doc.Id);
            if (_additionnalFilter != null)
                filter = Builders<TModel>.Filter.And(filter, _additionnalFilter);

            if (_isUpsert)
                options = new UpdateOptions() { IsUpsert = true };

           _task = _collection.ReplaceOneAsync(filter, _doc, options);

           return _task;
        }

        public long GetAffectedCount()
        {
            if (_task == null)
                throw new Exception("GetCountCalled before operation was executed");
            else if (_task.IsCompleted != true)
                throw new Exception("GetCountCalled before operation has had a chance to complete");
            else if (_task.IsFaulted)
                throw new Exception("GetCountCalled while the task has faulted");

            if (_isUpsert)
                return 1;
            else
                return _task.Result.MatchedCount;
        }
    }
}
