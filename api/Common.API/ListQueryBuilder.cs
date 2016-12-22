using System;
using System.Linq;
using System.Collections.Generic;

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

using System.Web.Http;

using Common.Data;
using Common.Types;

namespace Common.API
{
    public class QueryParametersBuilder
    {
        private const string SORT_BY = "sortby";
        private const string REVERSE_ORDER = "reverseorder";
        private const string CONTAINS_FILTER = "contains";
        private static readonly string[] IGNORED_FILTERS = {"format"};

        private QueryParametersBuilder() { }

        public static QueryParameters BuildFromHttpRequest(HttpRequestMessage request)
        {
            QueryParameters ret = new QueryParameters();
            // met tous les paramètres dans un dictionnaire pour accès rapide
            ret.KeyValueFilters = request.GetQueryNameValuePairs()
                                            .ToDictionary(p => p.Key.ToLower(), p=> p.Value);

            ret = ExtractContainsKeywords(ret.KeyValueFilters, ret);

            ret = InitializeRangeOptions(request, ret);
            ret = ExtractSortOptions(ret.KeyValueFilters, ret);

            ret = ExtractIgnoredFilters(ret);

            return ret;
        }

        private static QueryParameters InitializeRangeOptions(HttpRequestMessage request, QueryParameters query)
        {
            RangeHeaderValue rangeHeader = request.Headers.Range;
            RangeItemHeaderValue rangeValue = rangeHeader != null ? rangeHeader.Ranges.FirstOrDefault() : null;

            if (rangeValue != null)
            {
                query.RangeStart = (int)rangeValue.From;

                if (rangeValue.From != null && rangeValue.To != null)
                    query.RangeTake = (int)(rangeValue.To.Value - rangeValue.From.Value + 1);
            }
            return query;
        }

        private static QueryParameters ExtractSortOptions(Dictionary<string, string> urlParams, QueryParameters query) 
        {
            if (urlParams.ContainsKey(SORT_BY))
            {
                
                query.SortExpression = urlParams[SORT_BY];

                urlParams.Remove(SORT_BY);

                if (urlParams.ContainsKey(REVERSE_ORDER))
                {
                    bool b;
                    Boolean.TryParse(urlParams[REVERSE_ORDER], out b);
                    query.SortReverse = b;
                }
            }

            urlParams.Remove(REVERSE_ORDER);
            return query;
        }

        private static QueryParameters ExtractContainsKeywords(Dictionary<string, string> urlParams, QueryParameters query)
        {
            query.ContainsKeywords = new List<string>();
            if (urlParams.ContainsKey(CONTAINS_FILTER))
            {
                query.ContainsKeywords = urlParams[CONTAINS_FILTER].Split(new char[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                urlParams.Remove(CONTAINS_FILTER);
            }
            return query;
        }

        private static QueryParameters ExtractIgnoredFilters(QueryParameters query)
        {
            foreach (string ignoredFilterName in IGNORED_FILTERS)
            {
                query.KeyValueFilters.Remove(ignoredFilterName);
            }
            return query;
        }
    }
}