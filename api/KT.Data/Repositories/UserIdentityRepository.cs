using System;
using KT.Data.Models;

using Common.Data;
using Common.Data.MongoDB;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Threading.Tasks;
using System.Collections.Generic;
using Common.Data.MongoDB.MongoOperations;
using Microsoft.AspNet.Identity;
using System.Security.Claims;

namespace KT.Data.Repositories
{
    public class UserIdentityRepository : MongoDBRepository<string, UserIdentity>,
                                            IUserStore<UserIdentity>
    {
        public UserIdentityRepository(MongoDBContext context) : base(context, context.Collection<UserIdentity>())
        {
        }

        public Task<UserIdentity> FindByUserName(string userName, string hashedPassword)
        {
            var filter = _builder.And(_builder.Eq(i => i.UserName, userName.ToLower()),
                                      _builder.Eq(i => i.PasswordHash, hashedPassword));
            return _collection.Find(filter).FirstOrDefaultAsync();
        }

        public void UpdateName(UserIdentity identity)
        {
            var filter = _builder.Eq(i => i.Id, identity.Id);
            UpdateDefinition<UserIdentity> update = Builders<UserIdentity>.Update
                                .Set(i => i.FirstName, identity.FirstName)
                                .Set(i => i.LastName, identity.LastName);

            UpdateOperation<string, UserIdentity> op = new UpdateOperation<string, UserIdentity>(_collection, update, filter);
            _context.AddOperation(op);
        }

        public void ChangePassword(string id, string newPasswordHash)
        {
            var filter = _builder.Eq(i => i.Id, id);
            UpdateDefinition<UserIdentity> update = Builders<UserIdentity>.Update
                                .Set(i => i.PasswordHash, newPasswordHash);

            UpdateOperation<string, UserIdentity> op = new UpdateOperation<string, UserIdentity>(_collection, update, filter);
            _context.AddOperation(op);
        }

        #region IUserStore implementation
        public Task CreateAsync(UserIdentity user)
        {
            return _collection.InsertOneAsync(user);
        }

        public Task UpdateAsync(UserIdentity user)
        {
            // todo should add an optimistic concurrency check
            return _collection.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        public Task DeleteAsync(UserIdentity user)
        {
            return _collection.DeleteOneAsync(u => u.Id == user.Id);
        }

        public Task<UserIdentity> FindByNameAsync(string userName)
        {
            return _collection.Find(u => u.UserName == userName.ToLower()).FirstOrDefaultAsync();
        }
        
        public void Dispose()
        {
        }
        #endregion
    }
}
