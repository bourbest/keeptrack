using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Common.Data.MongoDB.Test
{
    public class TestUtils
    {
        public static string HOST { get { return ConfigurationManager.AppSettings["DatabaseHost"]; } }
        public static string DB_DEV { get { return ConfigurationManager.AppSettings["DatabaseName"]; } }
        public static string TEST_DB { get { return ConfigurationManager.AppSettings["DbTestName"]; } }

        public static void LoadData<TEntity>(TEntity[] foundEntities, TEntity[] notFoundEntities)
        {
            // prepare
            long expectedSaveCount = foundEntities.Length;
            MongoDBContext context = new MongoDBContext(HOST, TEST_DB);

            IMongoCollection<TEntity> repo = context.Collection<TEntity>();

            if (foundEntities != null && foundEntities.Length > 0)
                repo.InsertMany(foundEntities);

            if (notFoundEntities != null && notFoundEntities.Length > 0)
                repo.InsertMany(notFoundEntities);
        }

        public static void VerifyAllExpectedWereFound<TKey>(IEnumerable<IModel<TKey>> expected, IEnumerable<IModel<TKey>> results, string testName)
        {
            // assert
            Assert.AreEqual(expected.Count(), results.Count(), "Didn't find has many as expected " + testName);

            // check that all that should match are in the result set
            for (int i = 0; i < results.Count(); i++)
            {
                Assert.IsTrue(results.Any(insc => insc.Id.ToString() == expected.ElementAt(i).Id.ToString()),
                        string.Format("Didn't find 'found{0}' - {1}", i, testName));
            }
        }

        public static void ClearCollection(string collectionName)
        {
            MongoClient client = new MongoClient(HOST);
            IMongoDatabase db = client.GetDatabase(TEST_DB);
            db.GetCollection<BsonDocument>(collectionName).DeleteMany(_ => true);
        }

        public async static Task RemoveCollection(string collectionName)
        {
            MongoClient client = new MongoClient(HOST);
            IMongoDatabase db = client.GetDatabase(DB_DEV);

            await db.DropCollectionAsync(collectionName);
        }

        public static IMongoCollection<BsonDocument> CreateCollection(string collectionName)
        {
            MongoClient client = new MongoClient(HOST);
            IMongoDatabase db = client.GetDatabase(DB_DEV);

            CreateCollectionOptions options = new CreateCollectionOptions();
            options.StorageEngine = new BsonDocument("wiredTiger", new BsonDocument("configString", ""));
            options.AutoIndexId = true;

            Task t = db.CreateCollectionAsync(collectionName, options);
            t.Wait();

            return db.GetCollection<BsonDocument>(collectionName);
        }

        public static IAsyncCursor<BsonDocument> ListCollection()
        {
            MongoClient client = new MongoClient(HOST);
            IMongoDatabase db = client.GetDatabase(DB_DEV);

            IAsyncCursor<BsonDocument> toto = db.ListCollections();

            return toto;
        }

        public async static void DropDatabase()
        {
            MongoClient client = new MongoClient(HOST);

            await client.DropDatabaseAsync(DB_DEV);
        }
    }    
}
