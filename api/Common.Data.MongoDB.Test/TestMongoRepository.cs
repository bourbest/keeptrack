using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;


using MongoDB.Bson;
using MongoDB.Driver;

using Common.Data;
using Common.Types;
using Common.Data.MongoDB;

namespace Common.Data.MongoDB.Test
{
    [TestClass]
    public class TestMongoRepository
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
                    // placer les insertions globaes à tous les tests ici
                    // utiliser directement les Repository, pas les services
                }

                TestUtils.ClearCollection("TestModel");
            }
        }
        #endregion
        #region Insert
        [TestMethod]
        public async Task Insert_duplicate_throws()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            ObjectId duplicateId = ObjectId.GenerateNewId();
            MongoWriteException thrownException = null;

            doc.stringValue = "Bourbeau";
            doc.id = duplicateId;

            // execute
            repo.Insert(doc);
            repo.Insert(doc);
            try
            {
                await context.SaveChangesAsync();
            }
            catch (MongoWriteException ex)
            {
                thrownException = ex;
            }

            // assert
            Assert.IsNotNull(thrownException, "Duplicate insert did not throw as expected");
        }

        [TestMethod]
        public void Insert_with_null_id_throws()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            doc.id = null;
            Exception thrownException = null;

            doc.stringValue = "Bourbeau";

            // execute
            try
            {
                repo.Insert(doc);
            }
            catch (Exception ex)
            {
                thrownException = ex;
            }

            // assert
            Assert.IsNotNull(thrownException, "Duplicate insert did not throw as expected");
        }

        #endregion

        #region FindById
        [TestMethod]
        public async Task FindById_returns_null_when_no_match()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel foundDoc = null;
            ObjectId expectedId = ObjectId.GenerateNewId();

            // execute
            foundDoc = await repo.FindByIdAsync(expectedId);

            // assert
            Assert.IsNull(foundDoc, "Found a doc for an unexisting id");
        }


        [TestMethod]
        public async Task FindById_returns_entity_when_match()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel foundDoc = null;
            repo.Insert(new TestModel() { id = "1" });

            await context.SaveChangesAsync();
            // execute
            foundDoc = await repo.FindByIdAsync("1");

            // assert
            Assert.IsNotNull(foundDoc, "No doc Found for an unexisting id");
        }
        #endregion


        #region FindNextFromId
        [TestMethod]
        public async Task FindNextFromId_returns_n_next_entries_not_including_the_from_Id()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            repo.Insert(new TestModel() { id = "1" });
            repo.Insert(new TestModel() { id = "2" });
            repo.Insert(new TestModel() { id = "3" });
            repo.Insert(new TestModel() { id = "4" });

            await context.SaveChangesAsync();

            // execute
            List<TestModel> foundDocs = await repo.FindNextFromId("2", 2);

            // assert
            Assert.AreEqual(2, foundDocs.Count);
            Assert.AreEqual("3", foundDocs.First().id);
            Assert.AreEqual("4", foundDocs.Last().id);
        }

        [TestMethod]
        public async Task FindNextFromId_returns_remaining_entries_when_getcount_greater_than_remaining_count()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            repo.Insert(new TestModel() { id = "1" });
            repo.Insert(new TestModel() { id = "2" });
            repo.Insert(new TestModel() { id = "3" });
            repo.Insert(new TestModel() { id = "4" });

            await context.SaveChangesAsync();

            // execute
            List<TestModel> foundDocs = await repo.FindNextFromId("1", 40);

            // assert
            Assert.AreEqual(3, foundDocs.Count);
            Assert.AreEqual("2", foundDocs.First().id);
            Assert.AreEqual("3", foundDocs.ElementAt(1).id);
            Assert.AreEqual("4", foundDocs.Last().id);
        }

        #endregion

        #region FindByFilters
        [TestMethod]
        public async Task FindByFilters_returns_empty_list_when_no_match()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("StringValue", "patate");

            TestModel[] values = new TestModel[] { new TestModel() { stringValue = "Bourbeau"},
                                                    new TestModel() { stringValue = "Chiadmi"},
                                                    new TestModel() { stringValue = "Bourbeau"},
                                                    new TestModel() { stringValue = "Bourbeau2"}
            };

            repo.InsertRange(values.AsEnumerable());
            await context.SaveChangesAsync();

            // execute
            foundDocs = await repo.FindByFiltersAsync(queryParams);

            // assert
            Assert.IsNotNull(foundDocs, "received null instead of an empty list");
            Assert.AreEqual(0, foundDocs.Count);
        }

        [TestMethod]
        public async Task FindByFilters_returns_correct_list_when_matched()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;
            ObjectId[] expectedIds = new ObjectId[] { ObjectId.GenerateNewId(),
                                                        ObjectId.GenerateNewId()};

            TestModel[] values = new TestModel[] { new TestModel() { stringValue = "Bourbeau", id = expectedIds[0]},
                                                    new TestModel() { stringValue = "Chiadmi"},
                                                    new TestModel() { stringValue = "Bourbeau", id = expectedIds[1]},
                                                    new TestModel() { stringValue = "Bourbeau2"}
            };

            repo.InsertRange(values.AsEnumerable());
            await context.SaveChangesAsync();

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("stringValue", "Bourbeau");

            // execute
            foundDocs = await repo.FindByFiltersAsync(queryParams);

            // assert
            Assert.IsNotNull(foundDocs, "received null instead of an empty list");
            Assert.AreEqual(2, foundDocs.Count, "received count did not match");

            foreach (TestModel model in foundDocs)
            {
                Assert.AreEqual("Bourbeau", model.stringValue, "The 'nom' property wasnt as expecete");
                Assert.IsTrue(model.id.Equals(expectedIds[0]) || model.id.Equals(expectedIds[1]), "_id doesnt match expected ones");
            }
        }

        [TestMethod]
        public async Task FindByFilters_is_case_insensitive_on_property_name()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;
            ObjectId[] expectedIds = new ObjectId[] { ObjectId.GenerateNewId(),
                                                        ObjectId.GenerateNewId()};

            TestModel[] values = new TestModel[] { new TestModel() { stringValue = "Bourbeau", id = expectedIds[0]},
                                                    new TestModel() { stringValue = "Chiadmi", id = ObjectId.GenerateNewId()},
                                                    new TestModel() { stringValue = "Bourbeau", id = expectedIds[1]},
                                                    new TestModel() { stringValue = "Bourbeau2", id = ObjectId.GenerateNewId()}
            };

            repo.InsertRange(values.AsEnumerable());
            await context.SaveChangesAsync();

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("stringvalue", "Bourbeau");

            // execute
            foundDocs = await repo.FindByFiltersAsync(queryParams);

            // assert
            Assert.IsNotNull(foundDocs, "received null instead of an empty list");
            Assert.AreEqual(2, foundDocs.Count, "received count did not match");

            foreach (TestModel model in foundDocs)
            {
                Assert.AreEqual("Bourbeau", model.stringValue, "The 'nom' property wasnt as expecete");
                Assert.IsTrue(model.id.Equals(expectedIds[0]) || model.id.Equals(expectedIds[1]), "_id doesnt match expected ones");
            }
        }

        [TestMethod]
        public async Task FindByFilters_orderby_is_taken_into_account()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;
            ObjectId[] expectedIds = new ObjectId[] { ObjectId.GenerateNewId(),
                                                        ObjectId.GenerateNewId()};

            TestModel[] values = new TestModel[] { new TestModel() { stringValue = "A"},
                                                    new TestModel() { stringValue = "C"},
                                                    new TestModel() { stringValue = "B"},
                                                    new TestModel() { stringValue = "D"}
            };

            repo.InsertRange(values.AsEnumerable());
            await context.SaveChangesAsync();

            QueryParameters queryParams = new QueryParameters();
            queryParams.SortExpression = "stringvalue";

            // execute
            foundDocs = await repo.FindByFiltersAsync(queryParams);

            // assert
            Assert.IsNotNull(foundDocs, "received null instead of an empty list");
            Assert.AreEqual(4, foundDocs.Count, "received count did not match");
            int i = 0;
            string[] expected = new string[] { "A", "B", "C", "D" };
            foreach (TestModel model in foundDocs)
            {
                Assert.AreEqual(expected[i], model.stringValue, "The list was not ordered as expected");
                i++;
            }
        }

        [TestMethod]
        public async Task FindByFilters_unknown_filter_throws()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;
            FilterNotSupportedException thrownEx = null;

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("invalidField", "value");

            // execute
            try
            {
                foundDocs = await repo.FindByFiltersAsync(queryParams);
            }
            catch (FilterNotSupportedException ex)
            {
                thrownEx = ex;
            }

            // assert
            Assert.IsNotNull(thrownEx, "No exception was thrown");
            Assert.AreEqual("invalidField", thrownEx.Filter);
        }

        [TestMethod]
        public async Task FindByFilters_invalid_filter__value_throws()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;
            InvalidFilterValueException thrownEx = null;

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("intValue", "value");

            // execute
            try
            {
                foundDocs = await repo.FindByFiltersAsync(queryParams);
            }
            catch (InvalidFilterValueException ex)
            {
                thrownEx = ex;
            }

            // assert
            Assert.IsNotNull(thrownEx, "No exception was thrown");
            Assert.AreEqual("intValue", thrownEx.Filter);
        }

        [TestMethod]
        public async Task FindByFilters_modifiedSince_returns_only_modified_entities()
        {
            // prepare
            DateTime now = DateTime.Now;
            DateTime modifiedBefore = now.AddMinutes(-1);
            DateTime modifiedAfter = now.AddMilliseconds(1);
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            List<TestModel> foundDocs = null;
            ObjectId[] expectedIds = new ObjectId[] { ObjectId.GenerateNewId(),
                                                        ObjectId.GenerateNewId()};

            TestModel[] values = new TestModel[] {
                new TestModel() { stringValue = "A", ModifiedOn = modifiedBefore},
                new TestModel() { stringValue = "C", ModifiedOn = modifiedBefore},
                new TestModel() { stringValue = "B", ModifiedOn = now},
                new TestModel() { stringValue = "D", ModifiedOn = modifiedAfter}
            };

            repo.InsertRange(values.AsEnumerable());
            await context.SaveChangesAsync();

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("ModifiedSince", now.ToString());

            // execute
            foundDocs = await repo.FindByFiltersAsync(queryParams);

            // assert
            Assert.AreEqual(2, foundDocs.Count, "received count did not match");
            Assert.IsTrue(foundDocs[0].stringValue == "B" || foundDocs[0].stringValue == "D");
            Assert.IsTrue(foundDocs[1].stringValue == "B" || foundDocs[0].stringValue == "D");

        }
        #endregion

        #region Count
        [TestMethod]
        public async Task Count_returns_correct_count()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            int foundCount = 0;
            ObjectId[] expectedIds = new ObjectId[] { ObjectId.GenerateNewId(),
                                                        ObjectId.GenerateNewId()};

            TestModel[] values = new TestModel[] { new TestModel() { stringValue = "Bourbeau", id = expectedIds[0]},
                                                    new TestModel() { stringValue = "Chiadmi", id = ObjectId.GenerateNewId()},
                                                    new TestModel() { stringValue = "Bourbeau", id = expectedIds[1]},
                                                    new TestModel() { stringValue = "Bourbeau2", id = ObjectId.GenerateNewId()}
            };

            repo.InsertRange(values.AsEnumerable());
            await context.SaveChangesAsync();

            QueryParameters queryParams = new QueryParameters();
            queryParams.KeyValueFilters.Add("stringvalue", "Bourbeau");


            // execute
            foundCount = await repo.CountAsync(queryParams);

            // assert
            Assert.AreEqual(2, foundCount, "received count did not match");
        }
        #endregion

        #region Delete
        [TestMethod]
        public async Task Delete_byId_existing_removes_from_collection()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            TestModel foundDoc = null;
            ObjectId expectedId = ObjectId.GenerateNewId();

            doc.stringValue = "Bourbeau";
            doc.id = expectedId;

            repo.Insert(doc);
            long count = await context.SaveChangesAsync();

            // execute
            repo.Delete(expectedId);
            long deletedCount = await context.SaveChangesAsync();

            // assert
            foundDoc = await repo.FindByIdAsync(expectedId);

            Assert.AreEqual(1, count, "prepare did not insert the doc successfully");
            Assert.AreEqual(1, deletedCount, "deleted count did not match");
            Assert.IsNull(foundDoc, "found doc by Id even if it was deleted");
        }

        [TestMethod]
        public async Task Delete_unexisting_returns_0_deleted()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            ObjectId expectedId = ObjectId.GenerateNewId();

            // execute
            repo.Delete(expectedId);
            long deletedCount = await context.SaveChangesAsync();

            // assert
            Assert.AreEqual(0, deletedCount, "deleted count did not match");
        }

        [TestMethod]
        public async Task Delete_using_model_removes_from_collection()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            TestModel foundDoc = null;
            ObjectId expectedId = ObjectId.GenerateNewId();

            doc.stringValue = "Bourbeau";
            doc.id = expectedId;

            repo.Insert(doc);
            long count = await context.SaveChangesAsync();

            // execute
            repo.Delete(doc);
            long deletedCount = await context.SaveChangesAsync();

            // assert
            foundDoc = await repo.FindByIdAsync(expectedId);

            Assert.AreEqual(1, count, "prepare did not insert the doc successfully");
            Assert.AreEqual(1, deletedCount, "deleted count did not match");
            Assert.IsNull(foundDoc, "found doc by Id even if it was deleted");
        }

        #endregion

        #region Update
        [TestMethod]
        public async Task Update_changes_whole_doc_in_collection()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            TestModel foundDoc = null;
            ObjectId expectedId = ObjectId.GenerateNewId();

            doc.stringValue = "Bourbeau";
            doc.id = expectedId;

            repo.Insert(doc);
            long count = await context.SaveChangesAsync();

            // execute
            doc.stringValue = "Savard";
            repo.Update(doc);
            long updatedCount = await context.SaveChangesAsync();

            // assert
            foundDoc = await repo.FindByIdAsync(expectedId);

            Assert.AreEqual(1, count, "prepare did not insert the doc successfully");
            Assert.AreEqual(1, updatedCount, "updated count did not match");
            Assert.IsNotNull(foundDoc, "couldnt retrieve updated document");
            Assert.AreEqual("Savard", foundDoc.stringValue, "Update did not change doc's values");
        }

        [TestMethod]
        public async Task Update_returns_0_when_not_existing()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            ObjectId expectedId = ObjectId.GenerateNewId();

            doc.stringValue = "Bourbeau";
            doc.id = expectedId;

            // execute
            repo.Update(doc);
            long updatedCount = await context.SaveChangesAsync();

            // assert
            Assert.AreEqual(0, updatedCount, "updated count did not match");
        }
        #endregion

        #region Upsert
        [TestMethod]
        public async Task Upsert_changes_whole_doc_in_collection()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            TestModel foundDoc = null;
            ObjectId expectedId = ObjectId.GenerateNewId();

            doc.stringValue = "Bourbeau";
            doc.id = expectedId;

            repo.Insert(doc);
            long count = await context.SaveChangesAsync();

            // execute
            doc.stringValue = "Savard";
            repo.Upsert(doc);
            long updatedCount = await context.SaveChangesAsync();

            // assert
            foundDoc = await repo.FindByIdAsync(expectedId);

            Assert.AreEqual(1, count, "prepare did not insert the doc successfully");
            Assert.AreEqual(1, updatedCount, "updated count did not match");
            Assert.IsNotNull(foundDoc, "couldnt retrieve updated document");
            Assert.AreEqual("Savard", foundDoc.stringValue, "Update did not change doc's values");
        }

        [TestMethod]
        public async Task Upsert_inserts_if_not_existing()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();
            ObjectId expectedId = ObjectId.GenerateNewId();

            doc.stringValue = "Bourbeau";
            doc.id = expectedId;

            // execute
            repo.Upsert(doc);
            long updatedCount = await context.SaveChangesAsync();

            // assert
            var foundDoc = await repo.FindByIdAsync(expectedId);

            // assert
            Assert.AreEqual(1, updatedCount, "updated count did not match");
            Assert.AreEqual(doc.stringValue, foundDoc.stringValue);
        }
        #endregion



    }
}
