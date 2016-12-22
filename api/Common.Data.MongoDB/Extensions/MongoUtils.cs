using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Linq.Expressions;
using System.Reflection;

namespace Common.Data.MongoDB
{
    public class MongoUtil
    {
        public static string GetBsonElementName<TSource, TProperty>(Expression<Func<TSource, TProperty>> propertyLambda)
        {
            MemberExpression member = null;

            if (propertyLambda.Body.NodeType == ExpressionType.Convert)
                member = ((UnaryExpression)propertyLambda.Body).Operand as MemberExpression;
            else if (propertyLambda.Body.NodeType == ExpressionType.MemberAccess)
                member = propertyLambda.Body as MemberExpression;

            if (member == null)
                throw new ArgumentException(string.Format(
                    "Expression '{0}' refers to a method, not a property.",
                    propertyLambda.ToString()));

            PropertyInfo propInfo = member.Member as PropertyInfo;
            if (propInfo == null)
                throw new ArgumentException(string.Format(
                    "Expression '{0}' refers to a field, not a property.",
                    propertyLambda.ToString()));

            BsonElementAttribute attr = (BsonElementAttribute) propInfo.GetCustomAttribute(typeof(BsonElementAttribute));
            if (attr == null || attr.ElementName == null || attr.ElementName.Length == 0)
                return propInfo.Name;
            else
                return attr.ElementName;
        }
    }
}
