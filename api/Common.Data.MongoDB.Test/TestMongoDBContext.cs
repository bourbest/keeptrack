using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using MongoDB.Bson;

using Common.Data;
using Common.Data.MongoDB;
using Common.Data.MongoDB.MongoOperations;


namespace Common.Data.MongoDB.Test
{
    [TestClass]
    public class TestMongoContext
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
                    // placer les insertions dans la BD ici
                    // utiliser directement les Repository, pas les services
                }

                TestUtils.ClearCollection("TestModel");
            }
        }
#endregion

#region Tests class
        private class TestModel : IModel<Guid>
        {
            Guid IModel<Guid>.Id { get { return this.id; } }

            public string Nom { get; set; }
            public Guid id { get; set; }
            public DateTime CreatedOn { get; set; }
            public DateTime ModifiedOn { get; set; }
        }
#endregion

        [TestMethod]
        public async Task SaveAsync_clears_op()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc = new TestModel();

            var op = new InsertOperation<Guid, TestModel>(context.Collection<TestModel>(), doc);
            
            // execute
            context.AddOperation(op);
            long count = await context.SaveChangesAsync();

            // assert
            Assert.AreEqual(0, context.GetOperationCount());
        }

       

        [TestMethod]
        public async Task SaveAsync_clears_operations_on_exception()
        {
            // prepare
            MongoDBContext context = new MongoDBContext(TestUtils.HOST, TestUtils.TEST_DB);
            TestModelRepository repo = new TestModelRepository(context);
            TestModel doc1 = new TestModel();

            
            doc1.id = Guid.NewGuid();
            var op1 = new InsertOperation<Guid, TestModel>(context.Collection<TestModel>(), doc1);
            // execute
            context.AddOperation(op1);
            context.AddOperation(op1); // this will create an exception
            
            long count = 0;

            try
            {
                count = await context.SaveChangesAsync();
            }
            catch (Exception )
            {

            }

            // assert
            Assert.AreEqual(0, context.GetOperationCount());
        }
    }
}
