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
    public class InsertOperation<TKey, TModel> : IMongoDBWriteOperation where TModel : IModel<TKey>
    {
        private IMongoCollection<TModel> _collection;
        private TModel _doc;
        private IEnumerable<TModel> _docs;

        private Task _task;

        public InsertOperation(IMongoCollection<TModel> collection, TModel doc)
        {
            _collection = collection;
            _doc = doc;
        }

        public InsertOperation(IMongoCollection<TModel> collection, IEnumerable<TModel> docs)
        {
            _collection = collection;
            _docs = docs;
        }

        public Task Execute()
        {
            if (_doc != null)
                _task = _collection.InsertOneAsync(_doc);
            else
                _task = _collection.InsertManyAsync(_docs);
            return _task;
        }

        public long GetAffectedCount()
        {
            long count = 0;
            if (_task == null)
                throw new Exception("GetCountCalled before operation was executed");
            else if (_task.IsCompleted != true)
                throw new Exception("GetCountCalled before operation has had a chance to complete");

            if (_doc != null)
                count = _task.IsFaulted ? 0 : 1;
            else
                count = _docs.Count();

            return count;
        }
    }
}
