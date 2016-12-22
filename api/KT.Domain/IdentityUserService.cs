using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using KT.Data.Models;
using KT.Data.Repositories;
using Common.Domain;
using System.Security.Claims;

using Common.Types;
using Common.Data.MongoDB.MongoOperations;

namespace KT.Domain
{
    public class UserIdentityService : ServiceBase<string, UserIdentityRepository, UserIdentity>
    {
        IMEDomainContext _context;
        public UserIdentityService(IMEDomainContext ctx) :
            base(ctx.Uow, ctx.Uow.UserIdentities)
        {
            _context = ctx;
        }

        public override Task AddEntityAsync(UserIdentity newEntity)
        {
            newEntity.PasswordHash = HashPassword(newEntity.PasswordHash);
            return base.AddEntityAsync(newEntity);
        }

        public async Task<UserIdentity> AuthenticateWithPassword(string username, string password)
        {
            string hashedPassword = HashPassword(password);
            UserIdentity identity = await _context.Uow.UserIdentities.FindByUserName(username, hashedPassword).ConfigureAwait(false);

            return identity;
        }

        protected string HashPassword(string unhashedPassword)
        {
            // TODO Hash
            return unhashedPassword;
        }
}

}


