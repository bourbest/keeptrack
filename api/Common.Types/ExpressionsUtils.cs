using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types
{
    public class ExpressionsUtils
    {
        public static string GetPropertyName<TSource, TProperty>(Expression<Func<TSource, TProperty>> propertyLambda)
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

            return propInfo.Name;
        }

        public static Type GetPropertyType<TSource, TProperty>(Expression<Func<TSource, TProperty>> propertyLambda)
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

            return propInfo.PropertyType;
        }

        public static void SetPropertyValue<T, V>(T target, Expression<Func<T, V>> memberLamda, V value)
        {
            var memberSelectorExpression = memberLamda.Body as MemberExpression;
            if (memberSelectorExpression != null)
            {
                var property = memberSelectorExpression.Member as PropertyInfo;
                if (property != null)
                {
                    property.SetValue(target, value, null);
                }
            }
        }
    }
}
