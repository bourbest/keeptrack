using System.Threading.Tasks;

using KT.Data.Models;
using KT.Data.Repositories;
using Common.Domain;


namespace KT.Domain
{
    public class UserIdentityService : ServiceBase<string, UserIdentityRepository, UserIdentity>
    {
        IKTDomainContext _context;
        public UserIdentityService(IKTDomainContext ctx) :
            base(ctx.Uow, ctx.Uow.UserIdentities, ctx)
        {
            _context = ctx;
        }

        public override Task AddEntityAsync(UserIdentity newEntity)
        {
            newEntity.PasswordHash = HashPassword(newEntity.PasswordHash);
            return base.AddEntityAsync(newEntity);
        }

        public override async Task UpdateEntityAsync(UserIdentity newEntity)
        {
            UserIdentity identity = await _context.Uow.UserIdentities.FindByIdAsync(newEntity.Id).ConfigureAwait(false);

            if (identity == null)
                throw new EntityNotFoundException("Account", newEntity.Id);

            identity.LastName = newEntity.LastName;
            identity.FirstName= newEntity.FirstName;
            identity.Email = newEntity.Email;
            identity.Roles = newEntity.Roles;
            await base.UpdateEntityAsync(identity).ConfigureAwait(false);
        }

        public async Task<bool> ChangePassword(string userId, string oldPassword, string newPassword)
        {
            UserIdentity identity = await _context.Uow.UserIdentities.FindByIdAsync(userId).ConfigureAwait(false);
            string hashedOldPwd = HashPassword(oldPassword);
            string hashedNewPwd = HashPassword(newPassword);
            bool ret = false;
            if (identity == null)
                throw new EntityNotFoundException("Account", userId);
            else if (hashedOldPwd == identity.PasswordHash)
            {
                identity.PasswordHash = hashedNewPwd;
                await base.UpdateEntityAsync(identity);
                ret = true;
            }
                
            return ret;
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
