using System;
using System.Collections.Generic;

using System.Linq;
using System.Linq.Expressions;

using System.Threading;
using System.Threading.Tasks;

using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

using Common.Types;
using Common.Data.MongoDB.MongoOperations;
using System.Reflection;
using System.ComponentModel;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Data.MongoDB
{
    public class ModelProperty
    {
        public string ModelPropertyName { get; set; }
        public string BsonPropertyName { get; set; }
        public TypeConverter Converter { get; set; }
    }

    public abstract class MongoDBRepository<TKey, TModel> : IRepository<TKey, TModel> where TModel : IModel<TKey>
    {
        protected static FilterDefinitionBuilder<TModel> _builder = Builders<TModel>.Filter;
        protected static Dictionary<string, ModelProperty> _properties;

        protected MongoDBContext _context;
        protected IMongoCollection<TModel> _collection;

        public MongoDBRepository(MongoDBContext context, IMongoCollection<TModel> collection)
        {
            _collection = collection;
            _context = context;
        }

        static MongoDBRepository()
        {
            // construit un dictionnaire pour mapper le nom de la propriété à son convertisseur et son nom Bson
            _properties = new Dictionary<string, ModelProperty>();
            PropertyInfo[] properties = typeof(TModel).GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
            foreach (PropertyInfo property in properties)
            {
                ModelProperty modelProp = new ModelProperty() { ModelPropertyName = property.Name, BsonPropertyName = property.Name };
                
                // obtient le nom de la propriété MongoDB (si overriden avec un attribut)
                BsonElementAttribute attr = (BsonElementAttribute)property.GetCustomAttribute(typeof(BsonElementAttribute));
                if (attr != null && attr.ElementName != null && attr.ElementName.Length > 0)
                    modelProp.BsonPropertyName = attr.ElementName;

                modelProp.Converter = TypeDescriptor.GetConverter(property.PropertyType);
                
                _properties.Add(property.Name.ToLower(), modelProp);
            }
        }

        public void UseContext(MongoDBContext context)
        {
            _context = context;
        }

    #region abstract and overridables

        // doit être overriden pour ajouter le filtre qui gère le contains (si supporté)
        protected virtual FilterDefinition<TModel> GetContainsFilter(IEnumerable<string> keywords)
        {
            throw new NotImplementedException("You must override GetContainsFilter in your Repository if you want that feature");
        }

        // doit être overriden si on veut supporter des tris autre que sur l'ID
        protected virtual IFindFluent<TModel, TModel> ApplyOrderBy(IFindFluent<TModel, TModel> query, string sortExpression, bool reverse)
        {
            throw new NotImplementedException("You must override ApplyOrderBy in your repository in order to provide the sort. Sort is costy, do not use blindly");
        }

        protected virtual IFindFluent<TModel, TModel> ApplyLimit(IFindFluent<TModel, TModel> query, int limit)
        {
            return query.Limit(limit);
        }

        protected virtual IFindFluent<TModel, TModel> ApplyDefaultSort(IFindFluent<TModel, TModel> query)
        {
            return query;
        }

        protected virtual string EntityIdPropertyName
        {
            get { return "_id";  }
        }

        protected virtual FilterDefinition<TModel> GetFilter(string filterName, string filterValue)
        {
            ModelProperty propInfo = null;
            _properties.TryGetValue(filterName.ToLower(), out propInfo);

            if (propInfo == null)
            {
                throw new FilterNotSupportedException(filterName);
            }
            
            object filterObject;
            try
            {
                filterObject = propInfo.Converter.ConvertFromString(filterValue);
            }
            catch (Exception )
            {
                throw new InvalidFilterValueException(filterName, string.Format("Valeur de filtre invalide : {0}", filterValue));
            }

            return _builder.Eq(propInfo.BsonPropertyName, filterObject);
        }
        
    #endregion

        protected virtual FilterDefinition<TModel> BuildQuery(QueryParameters queryParameters)
        {
            // ajoute les filtres = (ou spéciaux si GetFilter est overriden)
            List<FilterDefinition<TModel>> filters = new List<FilterDefinition<TModel>>();
            foreach (KeyValuePair<string, string> kv in queryParameters.KeyValueFilters)
                filters.Add(GetFilter(kv.Key, kv.Value));

            if (queryParameters.ContainsKeywords.Count() > 0)
                filters.Add(GetContainsFilter(queryParameters.ContainsKeywords));

            return _builder.And(filters);
        }

        #region IRepository implementation
        public virtual async Task<int> CountAsync(QueryParameters queryParameters)
        {
            FilterDefinition<TModel> filter = _builder.Empty;
            if (queryParameters != null)
                filter = BuildQuery(queryParameters);
            long ret = await _collection.CountAsync(filter).ConfigureAwait(false);
            if (ret > int.MaxValue)
                ret = int.MaxValue;
            return (int)ret;
        }

        public virtual Task<List<TModel>> FindByFiltersAsync(QueryParameters queryParameters)
        {
            var filters = BuildQuery(queryParameters);

            var query = ApplyDefaultSort(_collection.Find(filters));

            if (queryParameters.HasLimit)
                query = ApplyLimit(query, queryParameters.Limit.Value);

            if (!string.IsNullOrEmpty(queryParameters.SortExpression))
                query = ApplyOrderBy(query, queryParameters.SortExpression, queryParameters.SortReverse);

            return query.ToListAsync();
        }

        public virtual Task<TModel> FindByIdAsync(TKey id)
        {
            var filter = _builder.Eq(EntityIdPropertyName, id);
            return _collection.Find(filter).FirstOrDefaultAsync();
        }

        public virtual Task<List<TModel>> FindByIdsAsync(IEnumerable<TKey> ids)
        {
            var filter = _builder.In(EntityIdPropertyName, ids);
            return _collection.Find(filter).ToListAsync();
        }

        public virtual Task<List<TModel>> FindAll(int? limit = null)
        {
            return _collection.Find(_builder.Empty).Limit(limit).ToListAsync();
        }

        public virtual Task<List<TModel>> FindNextFromId(TKey id, int getCount)
        {
            var filter = _builder.Gt(EntityIdPropertyName, id);
            var sort = Builders<TModel>.Sort.Ascending(EntityIdPropertyName);
            return _collection.Find(filter)
                              .Sort(sort)
                              .Limit(getCount)
                              .ToListAsync();
        }

        public virtual void Insert(TModel doc)
        {
          if (doc.Id == null || doc.Id.ToString() == string.Empty)
            throw new Exception("You forgot to set an id on your document");

            _context.AddOperation(new InsertOperation<TKey, TModel>(_collection, doc));
        }

        public virtual void InsertRange(IEnumerable<TModel> models)
        {
            foreach (var model in models)
                Insert(model);
        }

        public virtual void Update(TModel doc)
        {
            _context.AddOperation(new ReplaceOperation<TKey, TModel>(_collection, doc));
        }

        public virtual void Delete(TKey id)
        {
            _context.AddOperation(new DeleteOperation<TKey, TModel>(_collection, id));
        }

        public virtual void Delete(TModel doc)
        {
            Delete(doc.Id);
        }

        public void Upsert(TModel doc)
        {
            _context.AddOperation(new ReplaceOperation<TKey, TModel>(_collection, doc, true));
        }

        public void DeleteMany(IEnumerable<TKey> ids)
        {
            FilterDefinition<TModel> filter = _builder.In(EntityIdPropertyName, ids);
            _context.AddOperation(new DeleteOperation<TKey, TModel>(_collection, filter, false));
        }

        #endregion
    }
}