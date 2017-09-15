using System.Configuration;
using System.Threading.Tasks;
using Common.Data.MongoDB;

using KT.Data.Repositories;

using MongoDB.Driver;
using System;

namespace KT.Data
{
    public class KTMongoDBUnitOfWork : IKTUnitOfWork
    {
        private MongoDBContext _context;
        protected bool _disposed = false;

        protected static IMongoDatabase _database;

        public KTMongoDBUnitOfWork(bool performReadsOnReplicaSet = false, bool unsafeFastWrites = false)
        {
            _context = new MongoDBContext(_database, performReadsOnReplicaSet, unsafeFastWrites);
        }

        static KTMongoDBUnitOfWork()
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

        private FormTemplateRepository _formTemplates;
        public FormTemplateRepository FormTemplates
        {
            get
            {
                if (_formTemplates == null)
                    _formTemplates = new FormTemplateRepository(_context);
                return _formTemplates;
            }
        }

        private IKTUnitOfWork _fromReplicaSet;
        public IKTUnitOfWork FromReplicaSet
        {
            get
            {
                if (_fromReplicaSet == null)
                    _fromReplicaSet = new KTMongoDBUnitOfWork(true);
                return _fromReplicaSet;
            }
        }

        private IKTUnitOfWork _unsafeReplicaset;
        public IKTUnitOfWork UnsafeFastWrites
        {
            get
            {
                if (_unsafeReplicaset == null)
                    _unsafeReplicaset = new KTMongoDBUnitOfWork(false, true);
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
