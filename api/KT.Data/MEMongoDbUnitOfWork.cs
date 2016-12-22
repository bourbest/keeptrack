using System.Configuration;
using System.Threading.Tasks;
using Common.Data.MongoDB;

using KT.Data.Repositories;

using MongoDB.Driver;
using System;

namespace KT.Data
{
    public class MEMongoDBUnitOfWork : IMEUnitOfWork
    {
        private MongoDBContext _context;
        protected bool _disposed = false;

        protected static IMongoDatabase _database;

        public MEMongoDBUnitOfWork(bool performReadsOnReplicaSet = false, bool unsafeFastWrites = false)
        {
            _context = new MongoDBContext(_database, performReadsOnReplicaSet, unsafeFastWrites);
        }

        static MEMongoDBUnitOfWork()
        {
            MongoClient client = new MongoClient(ConfigurationManager.AppSettings["DatabaseHost"]);
            _database = client.GetDatabase(ConfigurationManager.AppSettings["DatabaseName"]);
        }

        private ClientFileRepository _clientFiles;
        public ClientFileRepository ClientFiles
        {
            get
            {
                if (_clientFiles == null)
                    _clientFiles = new ClientFileRepository(_context);

                return _clientFiles;
            }
        }

        private UserIdentityRepository _userIdentities;
        public UserIdentityRepository UserIdentities
        {
            get
            {
                if (_userIdentities == null)
                    _userIdentities = new UserIdentityRepository(_context);

                return _userIdentities;
            }
        }

        private IMEUnitOfWork _fromReplicaSet;
        public IMEUnitOfWork FromReplicaSet
        {
            get
            {
                if (_fromReplicaSet == null)
                    _fromReplicaSet = new MEMongoDBUnitOfWork(true);
                return _fromReplicaSet;
            }
        }

        private IMEUnitOfWork _unsafeReplicaset;
        public IMEUnitOfWork UnsafeFastWrites
        {
            get
            {
                if (_unsafeReplicaset == null)
                    _unsafeReplicaset = new MEMongoDBUnitOfWork(false, true);
                return _unsafeReplicaset;
            }
        }

        #region Dispose
        public void Dispose()
        {
            Dispose(true);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }
        #endregion

        #region IUnitOfWork
        public Task<long> SaveAsync()
        {
            return _context.SaveChangesAsync();
        }
        #endregion
    }
}
