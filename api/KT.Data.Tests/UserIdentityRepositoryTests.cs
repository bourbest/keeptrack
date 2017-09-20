using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Common.Data.MongoDB;
using Common.Data.MongoDB.Test;

using KT.Data.Models;
using KT.Data.Repositories;

namespace KT.Data.MongoDB.Test
{
    [TestClass]
    public class UserIdentityRepositoryTests
    {
        #region Initialization
        [TestInitialize]
        public void Initialize()
        {
            TestUtils.ClearCollection(typeof(UserIdentity).Name);
        }
        #endregion

        [TestMethod]
        public async Task FindByNameAsync_is_case_insensitive()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            UserIdentityRepository repo = new UserIdentityRepository(context);
            
            UserIdentity user1 = new UserIdentity()
            {
                UserName ="Test",
            };

            repo.Insert(user1);
            await context.SaveChangesAsync();

            // test
            UserIdentity result = await repo.FindByNameAsync("TEST");
            Assert.IsNotNull(result);
            Assert.AreEqual(user1.Id, result.Id);
        }

        [TestMethod]
        public async Task FindByUserNameAsync_is_case_insensitive()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            UserIdentityRepository repo = new UserIdentityRepository(context);

            UserIdentity user1 = new UserIdentity()
            {
                UserName = "Test",
                PasswordHash = "abc"
            };

            repo.Insert(user1);
            await context.SaveChangesAsync();

            // test
            UserIdentity result = await repo.FindByUserName("TEST", "abc");
            Assert.IsNotNull(result);
            Assert.AreEqual(user1.Id, result.Id);
        }

        [TestMethod]
        public async Task Change_password_changes_only_password()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            UserIdentityRepository repo = new UserIdentityRepository(context);

            UserIdentity user1 = new UserIdentity()
            {
                UserName = "Test",
                PasswordHash = "abc",
                FirstName = "Steph",
                LastName = "Bour",
                Roles = new string[] { "perm1"},
                SecurityStamp = "asdas"
            };

            repo.Insert(user1);
            await context.SaveChangesAsync();

            // test
            repo.ChangePassword(user1.Id, "newPassword");
            await context.SaveChangesAsync();

            // assert
            UserIdentity result = await repo.FindByIdAsync(user1.Id);
            Assert.AreEqual(user1.FirstName, result.FirstName);
            Assert.AreEqual(user1.LastName, result.LastName);
            Assert.AreEqual(user1.SecurityStamp, result.SecurityStamp);
            Assert.AreEqual("newPassword", result.PasswordHash);
        }
    }
}
