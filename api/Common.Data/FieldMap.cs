using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Common.Types;

namespace Common.Data
{
    public class FieldMap<T>
    {
        private Dictionary<string, Expression<Func<T, object>>> _dict = new Dictionary<string, Expression<Func<T, object>>>();

        public FieldMap<T> Add(string name, Expression<Func<T, object>> field)
        {
            _dict.Add(name.ToLower(), field);
            return this;
        }

        public FieldMap<T> Add(Expression<Func<T, object>> field)
        {
            string fieldName = ExpressionsUtils.GetPropertyName<T, object>(field);
            return  Add(fieldName, field);
        }

        public bool Has(string fieldName)
        {
            return (fieldName != null) ? _dict.ContainsKey(fieldName.ToLower()) : false;
        }

        public Expression<Func<T, object>> Get(string fieldName)
        {
            return _dict[fieldName.ToLower()];
        }

        public Expression<Func<T, object>> TryGet(string fieldName)
        {
            Expression<Func<T, object>> field = null;
            if (Has(fieldName))
                field = Get(fieldName);
            return field;
        }

        public IEnumerable<string> GetFieldNames()
        {
            return _dict.Keys.AsEnumerable();
        }
    }
}
