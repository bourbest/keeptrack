using System;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Common.Data.MongoDB.MongoOperations
{
    public class DeleteOperation<TKey, TModel> : IMongoDBWriteOperation where TModel : IModel<TKey>
    {
        private IMongoCollection<TModel> _collection;
        private FilterDefinition<TModel> _filter;
        private bool _deleteOne;

        private Task<DeleteResult> _task;

        public DeleteOperation(IMongoCollection<TModel> collection,
                               TKey id)
        {
            _collection = collection;
            _filter = Builders<TModel>.Filter.Eq("_id", id);
            _deleteOne = true;
        }

        public DeleteOperation(IMongoCollection<TModel> collection,
                                FilterDefinition<TModel> filter, 
                                bool deleteOne = false)
        {
            _collection = collection;
            _filter =filter;
            _deleteOne = deleteOne;
        }

        public Task Execute()
        {
            if (_deleteOne)
                _task = _collection.DeleteOneAsync(_filter);
            else
                _task = _collection.DeleteManyAsync(_filter);

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
            return _task.Result.DeletedCount;
        }
    }
}
