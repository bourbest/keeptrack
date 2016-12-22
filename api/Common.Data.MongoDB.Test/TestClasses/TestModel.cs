using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using MongoDB.Bson;

using Common.Data;
using Common.Data.MongoDB;
using Common.Data.MongoDB.MongoOperations;

using MongoDB.Bson.Serialization.Attributes;

namespace Common.Data.MongoDB.Test
{
    public class TestType
    {
        public long long1 { get; set; }
        public long long2 { get; set; }
    }

    public class TestModel : IModel<object>
    {
        public TestModel()
        {
            id = ObjectId.GenerateNewId();
        }

        [BsonIgnore]
        object IModel<object>.Id { get { return this.id; } }

        public string stringValue { get; set; }
        public object id { get; set; }
        public bool? boolValue { get; set; }
        public int? intValue { get; set; }
        public long? longValue { get; set; }
        public double? doubleValue { get; set; }
        public DateTime? dateTimeValue { get; set; }

        public TestType[] testTypes { get; set; }

        public object GetId() { return id; }
        public void SetId(object id) { id = (ObjectId)id; }
    }
}
