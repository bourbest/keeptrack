using System;
using System.Collections.Generic;

namespace Common.Types.Autocomplete
{

    public class MatchContainsStrategy : BaseMatchStrategy
    {
        public MatchContainsStrategy(IComparer<AutocompleteMatch> orderer = null) : base(orderer)
        {
        }

        public override bool CanRefine
        {
            get
            {
                return true;
            }
        }

        protected override List<AutocompleteMatch> FindMatch(IEnumerable<AutocompleteEntry> entries,
                                                    string valueToMatch,
                                                    AliasDictionary aliasDict)
        {
            List<AutocompleteMatch> results = new List<AutocompleteMatch>();
            string[] valuesToMatch = GetValuesToMatch(valueToMatch);

            foreach (AutocompleteEntry entry in entries)
            {
                AutocompleteMatch match = IsMatch(entry, valuesToMatch, aliasDict);
                if (match != null)
                    results.Add(match);
            }

            return results;
        }

        protected string[] GetValuesToMatch(string matchValue)
        {
            return NormalizeValueToMatch(matchValue)
                        .Split(AutocompleteEntryList.SEPARATORS, StringSplitOptions.RemoveEmptyEntries);
        }

        // returns null if at least on valuesToMatch does not match
        protected AutocompleteMatch IsMatch(AutocompleteEntry entry, string[] valuesToMatch, AliasDictionary aliasDict)
        {
            AutocompleteMatch ret = null;
            int matchCount = 0;
            StringMatch[] matches = new StringMatch[valuesToMatch.Length];

            foreach (string value in valuesToMatch)
            {
                HashSet<string> aliasValues = null;
                bool foundMatch = false;
                string word = value;
                int start = entry.SearchText.IndexOf(word);
                
                // if word is not found in name, check if an alias can be found WITH EXACT match
                if (start < 0 && aliasDict.TryGetValue(value, out aliasValues))
                {
                    foreach(string w in entry.Words)
                    {
                        if (aliasValues.Contains(w))
                        {
                            word = w;
                            start = entry.SearchText.IndexOf(word);
                            break;
                        }
                    }
                }

                if (start >= 0)
                {
                    matches[matchCount] = new StringMatch() { Value = word, Start = start };
                    matchCount++;
                    foundMatch = true;
                }

                // exit the loop if neither the word or its aliases were found
                if (!foundMatch)
                    break;
            }

            if (matchCount == valuesToMatch.Length)
            {
                ret = new AutocompleteMatch()
                {
                    Entry = entry,
                    MatchingName = entry.DisplayText,
                    MatchPositions = matches
                };
            }

            return ret;
        }       
    }
}