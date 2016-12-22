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
        public bool HasRange { get { return RangeStart.HasValue; } }
        public int? RangeStart { get; set; }
        public int? RangeTake { get; set; }
        public bool HasLimit { get { return Limit.HasValue; } }
        public int? Limit { get; set; }
    }
}
