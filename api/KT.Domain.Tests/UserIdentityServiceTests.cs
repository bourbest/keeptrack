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
        public async Task AuthenticateWithPassword_is_case_insensitive()
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

        
    }
}
