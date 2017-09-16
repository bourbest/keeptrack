using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using Common.Data;
using Common.Types;
using Common.Data.MongoDB;
using Common.Data.MongoDB.Test;

using KT.Data.Models;
using KT.Domain;
using Common.Domain;

namespace KT.Data.MongoDB.Test
{
    [TestClass]
    public class UserIdentityServiceTests
    {
        #region Initialization
        [TestInitialize]
        public void Initialize()
        {
            TestUtils.ClearCollection(typeof(UserIdentity).Name);
        }
        #endregion

        [TestMethod]
        public async Task AuthenticateWithPassword_returns_null_when_invalid_password()
        {
            UserIdentity identity = new UserIdentity()
            {
                PasswordHash = "test",
                UserName = "bourbest"
            };
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            await svc.AddEntityAsync(identity);

            UserIdentity result = await svc.AuthenticateWithPassword("bourbest", "sdfsd");
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task AuthenticateWithPassword_returns_null_when_user_not_exists()
        {
            UserIdentity identity = new UserIdentity()
            {
                PasswordHash = "test",
                UserName = "bourbest"
            };
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            await svc.AddEntityAsync(identity);

            UserIdentity result = await svc.AuthenticateWithPassword("bourbest2", "sdfsd");
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task AuthenticateWithPassword_returns_identity_when_password_match()
        {
            UserIdentity identity = new UserIdentity()
            {
                PasswordHash = "test",
                UserName = "bourbest"
            };
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            await svc.AddEntityAsync(identity);

            UserIdentity result = await svc.AuthenticateWithPassword("bourbest", "test");
            Assert.IsNotNull(result);
            Assert.AreNotEqual(identity.Id, result.Id);
        }

        [TestMethod]
        public async Task AuthenticateWithPassword_is_case_insensitive_on_username()
        {
            UserIdentity identity = new UserIdentity()
            {
                PasswordHash = "test",
                UserName = "bourbest"
            };
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            await svc.AddEntityAsync(identity);

            UserIdentity result = await svc.AuthenticateWithPassword("BOURBEST", "test");
            Assert.IsNotNull(result);
            Assert.AreNotEqual(identity.Id, result.Id);
        }

        [TestMethod]
        public async Task AddEntity_Hashes_Password()
        {
            string password = "test";
            UserIdentity identity = new UserIdentity() { PasswordHash = password };
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            await svc.AddEntityAsync(identity);

            Assert.AreNotEqual(password, identity.PasswordHash);

            UserIdentity result = await svc.GetEntityAsync(identity.Id);
            Assert.AreNotEqual(password, result.PasswordHash);
        }

        [TestMethod]
        public async Task UpdateEntity_Updates_only_writtable_Fields()
        {
            UserIdentity identity = new UserIdentity();
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            identity.UserName = "bourbest";
            identity.FirstName = "Joe";
            identity.LastName = "Bin";
            identity.PasswordHash = "sfsdfsdf";
            identity.Roles = new List<string>() { "test" };

            await svc.AddEntityAsync(identity);

            UserIdentity update = new UserIdentity();
            // cannot modify
            update.Id = identity.Id;
            update.CreatedOn = DateTime.Now.AddDays(-10);
            update.ModifiedOn = DateTime.Now.AddDays(-10);
            update.PasswordHash = "dsdfkjsldkj";
            update.SecurityStamp = "sdfsdfsd";
            update.UserName = "sdjfsdhfksjdhk";
            update.IsArchived = true;

            // can modify
            update.LastName = "new lastname";
            update.FirstName = "new firstname";
            update.Roles = new List<string>() { "new permissions" };

            // service will set modified date
            ctx.TaskBeginTime = DateTime.Now.RemoveTicks().AddDays(-1);
            await svc.UpdateEntityAsync(update);

            UserIdentity updated = await svc.GetEntityAsync(identity.Id);

            // modified
            Assert.AreEqual(update.FirstName, updated.FirstName);
            Assert.AreEqual(update.LastName, updated.LastName);
            Assert.AreEqual(update.Roles.First(), updated.Roles.First());
            // Assert.AreEqual(ctx.TaskBeginTime, updated.ModifiedOn);

            // unmodified
            Assert.AreEqual(identity.IsArchived, updated.IsArchived);
            // Assert.AreEqual(identity.CreatedOn, updated.CreatedOn);
            Assert.AreEqual(identity.PasswordHash, updated.PasswordHash);
            Assert.AreEqual(identity.UserName, updated.UserName);
            Assert.AreEqual(identity.SecurityStamp, updated.SecurityStamp);
        }

        [TestMethod]
        [ExpectedException(typeof(EntityNotFoundException))]
        public async Task Change_password_throws_when_user_not_found()
        {
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            bool ret = await svc.ChangePassword("asdas", "aaa", "asdas");
        }

        [TestMethod]
        public async Task Change_password_Returns_false_when_old_password_doesnt_match()
        {
            UserIdentity identity = new UserIdentity();
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            identity.UserName = "bourbest";
            identity.PasswordHash = "sfsdfsdf";

            await svc.AddEntityAsync(identity);

            bool ret = await svc.ChangePassword(identity.Id, "aaa", "asdas");

            Assert.IsFalse(ret);
        }

        [TestMethod]
        public async Task Change_password_Returns_true_when_old_password_matches()
        {
            UserIdentity identity = new UserIdentity();
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            identity.UserName = "bourbest";
            identity.PasswordHash = "test";

            await svc.AddEntityAsync(identity);

            bool ret = await svc.ChangePassword(identity.Id, "test", "new");

            Assert.IsTrue(ret);
        }

        [TestMethod]
        public async Task Change_password_hashes_new_password()
        {
            UserIdentity identity = new UserIdentity();
            KTDomainContext ctx = new KTDomainContext();
            UserIdentityService svc = new UserIdentityService(ctx);

            identity.UserName = "bourbest";
            identity.PasswordHash = "test";

            await svc.AddEntityAsync(identity);

            bool ret = await svc.ChangePassword(identity.Id, "test", "new");

            UserIdentity updated = await svc.GetEntityAsync(identity.Id);
            Assert.AreNotEqual("new", updated.PasswordHash);
        }
    }
}
