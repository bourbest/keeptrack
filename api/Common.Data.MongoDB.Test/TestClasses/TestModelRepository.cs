using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using MongoDB.Bson;
using MongoDB.Driver;
using Common.Data;
using Common.Data.MongoDB;
using Common.Data.MongoDB.MongoOperations;

namespace Common.Data.MongoDB.Test
{
    public class TestModelRepository : MongoDBRepository<object, TestModel>
    {
        private TestModelRepository() : base(null, null) { }
        public TestModelRepository(MongoDBContext context)
            : base(context, context.Collection<TestModel>())
        {
        }

        protected override string EntityIdPropertyName
        {
            get { return "id";  }
        }

        protected override IFindFluent<TestModel, TestModel> ApplyOrderBy(IFindFluent<TestModel, TestModel> query, string sortExpression, bool reverse)
        {
            if (reverse)
                return query.SortByDescending(x => x.stringValue);
            else
                return query.SortBy(x => x.stringValue);
        }
    }
}
