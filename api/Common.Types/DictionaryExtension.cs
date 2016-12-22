using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types
{
    public static class DictionaryExtension
    {
        public static void TryAdd<TKey, TValue>(this Dictionary<TKey, TValue> dict, TKey key, TValue value)
        {
            if (!dict.ContainsKey(key))
                dict.Add(key, value);
        }

        public static List<TValue> ToList<TKey, TValue>(this Dictionary<TKey, TValue> dict)
        {
            return dict.Select(kv => kv.Value).ToList();
        }

        public static Dictionary<TKey, TValue> ToDictionary<TKey, TValue>(this List<TValue> list, Func<TValue, TKey> getKey)
        {
            Dictionary<TKey, TValue> ret = new Dictionary<TKey, TValue>();
            list.ForEach(i => ret.Add(getKey(i), i));
            return ret;
        }
    }


}
