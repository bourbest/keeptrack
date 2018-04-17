using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;


using MongoDB.Bson;
using MongoDB.Driver;

using Common.Data;
using Common.Types;
using KT.Data.Models;
using Common.Data.MongoDB;
using Common.Data.MongoDB.Test;
using KT.Data.Repositories;

namespace ME.Data.Tests
{
    [TestClass]
    public class TestClientFileRepository
    {
        #region Initialization
        private static object hasInitialized = false;
        [TestInitialize]
        public void Initialize()
        {
            lock (hasInitialized)
            {
                if (hasInitialized.Equals(false))
                {
                    // pour accélérer les tests on réutilise le context
                    // ca évite de rétablir la connexion à chaque fois

                    hasInitialized = true;
                    // vider toutes les tables
                    // placer les insertions globales à tous les tests ici
                    // utiliser directement les Repository, pas les services
                }

                TestUtils.ClearCollection(typeof(ClientFile).Name);
            }
        }
        #endregion

        private async Task InsertTestData(ClientFile[] founds = null, ClientFile[] notFounds = null)
        {
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            ClientFileRepository repo = new ClientFileRepository(context);

            int count = 0;
            if (founds != null)
            {
                count = founds.Count();
                repo.InsertRange(founds);
            }

            if (notFounds != null)
            {
                count += notFounds.Count();
                repo.InsertRange(notFounds);
            }

            long savedCount = await context.SaveChangesAsync();

            // test
            List<ClientFile> eventResult = await repo.FindAll();

            // assert
            Assert.AreEqual(savedCount, eventResult.Count(), "Saved number didnt match");

            Assert.AreEqual(count, eventResult.Count(), "Didn't find has many as expected");
        }

        #region text search

        [TestMethod]
        public async Task FindByNameFilter()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            ClientFileRepository repo = new ClientFileRepository(context);

            ClientFile[] found = new ClientFile[]
            {
                new ClientFile() {FirstName = "Steeve", LastName = "Amber"},
                new ClientFile() { FirstName = "Stella", LastName = "Artois" }
            };

            ClientFile[] notFound = new ClientFile[]
            {
                new ClientFile() {FirstName = "Stu", LastName = "Bourne"},
                new ClientFile() {FirstName = "Stéphane", LastName = "Bourbeau"}, // has order 3
                new ClientFile() { FirstName = "Molten", LastName = "Gamache" }
            };

            await InsertTestData(found, notFound);

            // test
            QueryParameters filters = new QueryParameters();
            filters.KeyValueFilters.Add("fullname", "stÉ");
            filters.SortExpression = "fullname";
            filters.Limit = 2;
            List<ClientFile> result = await repo.FindByFiltersAsync(filters);

            // assert
            TestUtils.VerifyAllExpectedWereFound<Guid>(found, result, "FindByNameFilter");
        }

        [TestMethod]
        public async Task FindByNameFilter_noResult()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            ClientFileRepository repo = new ClientFileRepository(context);

            ClientFile[] notFound = new ClientFile[]
            {
                new ClientFile() {FirstName = "Stu", LastName = "Bourne"},
                new ClientFile() {FirstName = "Stéphane", LastName = "Bourbeau"}, // has order 3
                new ClientFile() { FirstName = "Molten", LastName = "Gamache" }
            };

            await InsertTestData(null, notFound);

            // test
            QueryParameters filters = new QueryParameters();
            filters.KeyValueFilters.Add("fullname", "e");
            filters.SortExpression = "fullname";
            filters.Limit = 2;
            List<ClientFile> result = await repo.FindByFiltersAsync(filters);

            // assert
            Assert.AreEqual(0, result.Count);
        }
        #endregion
    }
}
