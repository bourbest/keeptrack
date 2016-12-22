using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MongoDB.Driver;
using MongoDB.Bson;

using System.Linq.Expressions;
using Common.Types;
using MongoDB.Driver.GeoJsonObjectModel;
using Common.Data.MongoDB;
using Common.Types.Log;

namespace KT.Tools.MongoDBSetup
{
    public class MongoDBSetupHelper
    {
        IObserver _observer;
        public MongoDBSetupHelper(IObserver observer)
        {
            _observer = observer;
        }

        public void DropIndex<TDoc>(IMongoCollection<TDoc> collection, string name)
        {
            try
            {
                _observer.LogAction($"Dropping index {name}");
                collection.Indexes.DropOne(name);
            }
            catch (Exception)
            { }
        }

        public IMongoCollection<BsonDocument> CreateCollection(IMongoDatabase db, string collectionName)
        {
            _observer.LogAction(string.Format("Creating collection: {0}", collectionName));
            CreateCollectionOptions options = new CreateCollectionOptions();
            options.StorageEngine = new BsonDocument("wiredTiger", new BsonDocument("configString", ""));
            options.AutoIndexId = true;

            Task t = db.CreateCollectionAsync(collectionName, options);
            t.Wait();

            return db.GetCollection<BsonDocument>(collectionName).WithWriteConcern(WriteConcern.WMajority);
        }

        public void CreateCombinedIndex<TDoc>(IMongoCollection<TDoc> collection, IEnumerable<Expression<Func<TDoc, object>>> fields,
            string name, FilterDefinition<TDoc> partialfilter = null)
        {
            if (name == null)
            {
                throw new ArgumentNullException("name");
            }

            _observer.LogAction(string.Format("{0} - Creating index: {1}", collection.CollectionNamespace.CollectionName, name));

            IndexKeysDefinitionBuilder<TDoc> builder = new IndexKeysDefinitionBuilder<TDoc>();

            List<IndexKeysDefinition<TDoc>> keys = new List<IndexKeysDefinition<TDoc>>();
            foreach (Expression<Func<TDoc, object>> field in fields)
                keys.Add(builder.Ascending(field));

            var indexKeys = builder.Combine(keys);
            CreateIndexOptions<TDoc> idxOptions = new CreateIndexOptions<TDoc>() { Name = name };

            if (partialfilter != null)
                idxOptions.PartialFilterExpression = partialfilter;

            Task t = collection.Indexes.CreateOneAsync(indexKeys, idxOptions);
            t.Wait();
        }

        private FilterDefinition<TDoc> CreateIndexFilter<TDoc>(bool exlcudeNulls, Expression<Func<TDoc, object>> field, FilterDefinition<TDoc> otherFilters)
        {
            FilterDefinitionBuilder<TDoc> builder = new FilterDefinitionBuilder<TDoc>();
            FilterDefinition<TDoc> excludeNullFilter = null;
            FilterDefinition<TDoc> ret = null;
            if (exlcudeNulls)
            {
                excludeNullFilter = builder.Exists(field, true);
                if (otherFilters != null)
                    ret = builder.And(excludeNullFilter, otherFilters);
                else
                    ret = excludeNullFilter;
            }
            else if (otherFilters != null)
                ret = otherFilters;

            return ret;
        }

        public void CreateIndex<TDoc>(IMongoCollection<TDoc> collection, Expression<Func<TDoc, object>> field,
            string name = null, FilterDefinition<TDoc> partialfilter = null, bool excludeNulls = true)
        {
            if (name == null)
            {
                name = BuildStandardIndexName(collection.CollectionNamespace.CollectionName, MongoUtil.GetBsonElementName(field));
                if (partialfilter != null)
                    name += "Partial";
            }

            _observer.LogAction(string.Format("{0} - Creating index: {1}", collection.CollectionNamespace.CollectionName, name));

            IndexKeysDefinitionBuilder<TDoc> builder = new IndexKeysDefinitionBuilder<TDoc>();
            IndexKeysDefinition<TDoc> keys;

            if ((ExpressionsUtils.GetPropertyType(field) == typeof(GeoJsonPoint<GeoJson2DGeographicCoordinates>)))
                keys = builder.Geo2DSphere(field);
            else
                keys = builder.Ascending(field);

            CreateIndexOptions<TDoc> idxOptions = idxOptions = new CreateIndexOptions<TDoc>() { Name = name };

            FilterDefinition<TDoc> indexFilter = CreateIndexFilter<TDoc>(excludeNulls, field, partialfilter);
            if (indexFilter != null)
                idxOptions.PartialFilterExpression = indexFilter;

                
            Task t = collection.Indexes.CreateOneAsync(keys, idxOptions);
            t.Wait();
        }

        public string BuildStandardIndexName(string collectionName, string fieldName)
        {
            return string.Format("{0}_{1}_Index", collectionName, fieldName);
        }
    }
}
