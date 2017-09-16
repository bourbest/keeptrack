using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

using MongoDB.Bson;
using MongoDB.Driver;

using Common.Data;
using Common.Data.MongoDB.MongoOperations;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace Common.Data.MongoDB
{
    public class MongoDBContext : IDbContext
    {
        private bool _disposed = false;
        private readonly Guid _instanceId;

        private readonly IMongoDatabase _database;

        private List<IMongoDBWriteOperation> _operations;

        private bool _performReadOnReplicaSet;
        private bool _unsafeFastWrites;

        public MongoDBContext(string connectionString, string dbName, bool performReadOnReplicaSet = false, bool unsafeFastWrites = false)
        {
            _operations = new List<IMongoDBWriteOperation>();
            _instanceId = Guid.NewGuid();
            MongoClient client = new MongoClient(connectionString);
            _database = client.GetDatabase(dbName);
            _performReadOnReplicaSet = performReadOnReplicaSet;
            _unsafeFastWrites = unsafeFastWrites;
        }

        public MongoDBContext(IMongoDatabase db, bool performReadOnReplicaSet = false, bool unsafeFastWrites = false)
        {
            _operations = new List<IMongoDBWriteOperation>();
            _instanceId = Guid.NewGuid();
            _database = db;
            _performReadOnReplicaSet = performReadOnReplicaSet;
            _unsafeFastWrites = unsafeFastWrites;
        }

        static MongoDBContext()
        {
            try
            {
                BsonSerializer.RegisterSerializer(typeof(DateTime),
                        new DateTimeSerializer(DateTimeKind.Local));

                BsonSerializer.RegisterSerializer(typeof(Guid),
                    new GuidSerializer(BsonType.Binary));
            }
            catch (Exception )
            { }
            
            MongoDefaults.GuidRepresentation = GuidRepresentation.Standard;
        }

        public IMongoCollection<TModel> Collection<TModel>()
        {
            return Collection<TModel>(typeof(TModel).Name);
        }

        public IMongoCollection<TModel> Collection<TModel>(string collectionName)
        {
            ReadPreference rp = _performReadOnReplicaSet ? ReadPreference.SecondaryPreferred : ReadPreference.Primary;
            WriteConcern wc = _unsafeFastWrites ? WriteConcern.Unacknowledged : WriteConcern.WMajority;
            return _database.GetCollection<TModel>(collectionName)
                        .WithWriteConcern(wc)
                        .WithReadPreference(rp);
        }

        public long GetOperationCount()
        {
            return _operations.Count;
        }

        public void AddOperation(IMongoDBWriteOperation operation)
        {
            _operations.Add(operation);
        }

        #region IDbContext implementation
        public Guid InstanceId
        {
            get { return _instanceId; }
        }

        public async Task<long> SaveChangesAsync()
        {
            long count = 0;
            List<Task> tasks = new List<Task>();
            foreach (IMongoDBWriteOperation operation in _operations)
            {
                tasks.Add(operation.Execute());
            }

            try
            {
                await Task.WhenAll(tasks.ToArray()).ConfigureAwait(false);


                foreach (IMongoDBWriteOperation operation in _operations)
                {
                    count += operation.GetAffectedCount();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw; ;
            }
            finally
            {
                _operations.Clear();
            }

            return count;
        }

        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
            if (!_disposed)
                Dispose(true);
        }

        public virtual void Dispose(bool disposing)
        {
            _disposed = true;
        }
        #endregion

    }
}