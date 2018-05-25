using System;
using System.Collections.Generic;

namespace Common.Types
{
    public class QueryParameters
    {
        public QueryParameters()
        {
            KeyValueFilters = new Dictionary<string, string>();
            ContainsKeywords = new List<string>();
            SortReverse = false;
        }

        public Dictionary<string, string> KeyValueFilters { get; set; }
        public IEnumerable<string> ContainsKeywords { get; set; }
        public bool SortReverse { get; set; }
        public string SortExpression { get; set; }
        public bool HasPage { get { return Page.HasValue || Limit.HasValue; } }
        public int? Page { get; set; }
        public int? Limit { get; set; }
    }
}
