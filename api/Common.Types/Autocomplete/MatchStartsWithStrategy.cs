using System;
using System.Collections.Generic;
using System.Linq;

namespace Common.Types.Autocomplete
{

    public class MatchStartsWithStrategy : BaseMatchStrategy
    {
        private static AutocompleteMatchAlphaOrderer _defaultOrderer = new AutocompleteMatchAlphaOrderer();
        public MatchStartsWithStrategy(IComparer<AutocompleteMatch> orderer = null) : base(orderer)
        {
            if (orderer == null)
            {
                _matchOrderer = _defaultOrderer;
            }
        }

        public override bool CanRefine { get { return true; } }

        protected override List<AutocompleteMatch> FindMatch(IEnumerable<AutocompleteEntry> entries,
                                                            string valueToMatch,
                                                            AliasDictionary aliasDict)
        {
            List<AutocompleteMatch> results = new List<AutocompleteMatch>();
            valueToMatch = NormalizeValueToMatch(valueToMatch);

            foreach (AutocompleteEntry entry in entries)
            {
                AutocompleteMatch match = IsMatch(entry, valueToMatch, aliasDict);
                if (match != null)
                    results.Add(match);
            }

            return results;
        }

        protected AutocompleteMatch IsMatch(AutocompleteEntry entry, string valueToMatch, AliasDictionary aliasDict)
        {
            AutocompleteMatch ret = null;
            string[] valuesToMatch = valueToMatch.Split(AutocompleteEntryList.SEPARATORS, StringSplitOptions.RemoveEmptyEntries);
            if (valuesToMatch.Length > entry.Words.Count())
                return ret;

            List<StringMatch> matches = new List<StringMatch>();
            for (int i = 0; i < valuesToMatch.Length; i++)
            {
                string word = entry.Words.ElementAt(i);
                HashSet<string> aliases = null;

                bool match = word.StartsWith(valuesToMatch[i]);
                if (!match && aliasDict.TryGetValue(valuesToMatch[i], out aliases))
                    match = aliases.Contains(word);

                if (!match)
                    break;
               
                if (match)
                {
                    StringMatch strMatch = new StringMatch()
                    {
                        Start = entry.SearchText.IndexOf(word),
                        Value = word
                    };
                    matches.Add(strMatch);
                }
            }

            if (matches.Count == valuesToMatch.Length)
            { 
                ret = new AutocompleteMatch()
                {
                    Entry = entry,
                    MatchingName = entry.DisplayText,
                    MatchPositions = matches.ToArray()
                };
            }

            return ret;
        }
    }
}