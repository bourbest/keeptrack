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
using KT.Data.Repositories;

namespace KT.Data.MongoDB.Test
{
    [TestClass]
    public class UserIdentityTests
    {
        [TestMethod]
        public void Constructor_initializes_lists()
        {
            UserIdentity[] users = {
                new UserIdentity(),
                new UserIdentity((IPrincipal) null),
                new UserIdentity((ClaimsIdentity) null)
            };

            foreach (UserIdentity user in users)
            {
                Assert.IsNotNull(user.Permissions);
                Assert.IsNotNull(user.Claims);
            }
        }

        [TestMethod]
        public void Constructor_initialize_id()
        {
            UserIdentity[] users = {
                new UserIdentity(),
                new UserIdentity((IPrincipal) null),
                new UserIdentity((ClaimsIdentity) null)
            };

            foreach (UserIdentity user in users)
                Assert.IsFalse(string.IsNullOrEmpty(user.Id));
        }

        [TestMethod]
        public void Set_property_set_related_claim_value()
        {
            UserIdentity user1 = new UserIdentity()
            {
                UserName ="Test",
                FirstName = "Stephane",
                LastName = "Bourbeau",
                Permissions = new string[] {"perm1", "perm2"}
            };

            Assert.IsTrue(user1.Claims.Any(c => c.Type == MEClaimTypes.FirstName && c.Value == user1.FirstName));
            Assert.IsTrue(user1.Claims.Any(c => c.Type == MEClaimTypes.LastName && c.Value == user1.LastName));
            Assert.IsTrue(user1.Claims.Any(c => c.Type == MEClaimTypes.Permissions && c.Value == string.Join(",", user1.Permissions)));

            Assert.IsTrue(user1.Claims.Any(c => c.Type == ClaimTypes.NameIdentifier && c.Value == user1.Id));
            Assert.IsTrue(user1.Claims.Any(c => c.Type == ClaimTypes.Name && c.Value == user1.UserName));
        }

        [TestMethod]
        public void Constructor_ClaimsIdentity_loads_claim_values()
        {
            ClaimsIdentity ci = new ClaimsIdentity();
            ci.AddClaim(new Claim(ClaimTypes.NameIdentifier, "1"));
            ci.AddClaim(new Claim(ClaimTypes.Name, "test"));
            ci.AddClaim(new Claim(MEClaimTypes.FirstName, "stephane"));
            ci.AddClaim(new Claim(MEClaimTypes.LastName, "bourbeau"));
            ci.AddClaim(new Claim(MEClaimTypes.Permissions, "perm1,perm2"));

            UserIdentity user = new UserIdentity(ci);
            Assert.AreEqual("1", user.Id);
            Assert.AreEqual("test", user.UserName);
            Assert.AreEqual("stephane", user.FirstName);
            Assert.AreEqual("bourbeau", user.LastName);

            Assert.AreEqual(2, user.Permissions.Count());
            Assert.IsTrue(user.Permissions.Contains("perm1"));
            Assert.IsTrue(user.Permissions.Contains("perm2"));
        }

        [TestMethod]
        public void UserName_enforces_lowercase()
        {
            UserIdentity user = new UserIdentity() { UserName = "Steph" };

            Assert.AreEqual("steph", user.UserName);
        }


        [TestMethod]
        public void HasPermission_returns_true_when_user_has_permission()
        {
            string[] permissions = { "perm1" };
            UserIdentity user = new UserIdentity() { Permissions = permissions };

            Assert.AreEqual(true, user.HasPermission("perm1"));
        }

        [TestMethod]
        public void HasPermission_returns_false_when_user_doesnt_have_permission()
        {
            string[] permissions = { "perm1" };
            UserIdentity user = new UserIdentity() { Permissions = permissions };

            Assert.AreEqual(false, user.HasPermission("perm2"));
        }

        [TestMethod]
        public void HasAnyPermission_returns_true_when_user_has_at_least_one_of_the_permissions()
        {
            string[] permissions = { "perm1", "perm2" };
            UserIdentity user = new UserIdentity() { Permissions = permissions };

            Assert.AreEqual(true, user.HasAnyPermission(new string[] { "perm20", "perm2" }));
        }

        [TestMethod]
        public void HasAnyPermission_returns_false_when_user_has_none_of_the_permissions()
        {
            string[] permissions = { "perm1", "perm2" };
            UserIdentity user = new UserIdentity() { Permissions = permissions };

            Assert.AreEqual(false, user.HasAnyPermission(new string[] { "perm20", "perm22" }));
        }
    }
}
