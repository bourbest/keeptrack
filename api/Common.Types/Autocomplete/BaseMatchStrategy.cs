using System;
using System.Collections.Generic;

namespace Common.Types.Autocomplete
{

    public abstract class BaseMatchStrategy : IAutocompleteMatchStrategy
    {
        private static AutocompleteMatchPositionOrderer _defaultOrderer = new AutocompleteMatchPositionOrderer();
        private static MatchPositionOrderer stringMatchOrderer = new MatchPositionOrderer();


        protected IComparer<AutocompleteMatch> _matchOrderer;

        public BaseMatchStrategy(IComparer<AutocompleteMatch> orderer = null)
        {
            _matchOrderer = orderer;
            if (_matchOrderer == null)
                _matchOrderer = _defaultOrderer;
        }

        protected string NormalizeValueToMatch(string matchValue)
        {
            return matchValue
                       .ToLower()
                       .RemoveDiacritics();
        }

        public IEnumerable<AutocompleteMatch> GetMatches(string matchValue,
                                                         IEnumerable<AutocompleteEntry> entries,
                                                         AliasDictionary aliasDict = null)
        {
            if (matchValue == null || matchValue == string.Empty)
                throw new ArgumentNullException("matchValue");
            if (entries == null)
                throw new ArgumentNullException("entries");

            if (aliasDict == null)
                aliasDict = new AliasDictionary();

            List<AutocompleteMatch> results = FindMatch(entries, matchValue, aliasDict);

            results.Sort(_matchOrderer);

            // to ease display, order and merge found positions
            foreach (AutocompleteMatch res in results)
                res.MatchPositions = SortAndMergeOverlappingStringMatch(res.MatchPositions);

            return results;
        }
        
        protected abstract List<AutocompleteMatch> FindMatch(IEnumerable<AutocompleteEntry> entries, 
                                                        string valuesToMatch, 
                                                        AliasDictionary aliasDict);
        
        public abstract bool CanRefine { get;  }

        private StringMatch[] SortAndMergeOverlappingStringMatch(StringMatch[] matchArray)
        {
            Array.Sort(matchArray, stringMatchOrderer);
            StringMatch previous = matchArray[0];
            List<StringMatch> mergedList = new List<StringMatch>();

            mergedList.Add(previous);
            /*
            overlap
            over
             ve         1 - 4 = -3
             verl       1 - 4 = -3
               rlap     3 - 4 = -1
                lap     4 - 4 = 0
                 ap     5 - 4 = 1
            */
            for (int i = 1; i < matchArray.Length; i++)
            {
                int overlap = matchArray[i].Start - (previous.Start + previous.Value.Length);
                if (overlap > 0)
                {
                    previous = matchArray[i];
                    mergedList.Add(previous);
                }
                else
                {
                    overlap *= -1;
                    if (overlap < matchArray[i].Value.Length)
                        previous.Value += matchArray[i].Value.Substring(overlap);
                }
            }

            return mergedList.ToArray();
        }
    }
}