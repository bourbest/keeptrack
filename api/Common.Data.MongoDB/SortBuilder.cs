using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Data;

namespace Common.Data.MongoDB
{
    public class SortBuilder<T>
    {
        public static SortDefinition<T> Build(FieldMap<T> acceptedSorts, ICollection<KeyValuePair<string, int>> sortParams)
        {
            var sortBuilder = Builders<T>.Sort;
            List<SortDefinition<T>> sorts = new List<SortDefinition<T>>();

            foreach (KeyValuePair<string, int> sortItem in sortParams)
            {
                var field = acceptedSorts.TryGet(sortItem.Key);
                if (field != null)
                {
                    if (sortItem.Value > 0)
                        sorts.Add(sortBuilder.Ascending(field));
                    else
                        sorts.Add(sortBuilder.Descending(field));
                }
                else
                {
                    throw new SortByNotSupportedException(sortItem.Key);
                }
            }

            return sortBuilder.Combine(sorts);
        }
    }
}
