using System;
using System.Collections.Generic;
using Common.Types;

namespace Common.Types.Autocomplete
{
    // Allows to use many names for the same value
    // ex.: "av. Tremblay" or "avenue Tremblay", "Saint-Michel" or "St-Michel", etc.
    public class AutocompleteEntry
    {
        public object Value { get; set; }
        public string DisplayText { get; set; }
        public string SearchText { get; set; }  // display text lowercase, diatritics removed
        public IEnumerable<string> Words { get; set; } // 
        public int TieBreaker { get; set; }
    };

    // need to keep track of Value in case we use Fuzzy search
    // will allow client to format matching values
    public class StringMatch
    {
        public string Value;
        public int Start;
    }

    // Since an entry can have more than one name, this class is used to link a value to its best matching name
    public class AutocompleteMatch
    {
        public AutocompleteEntry Entry { get; set; }
        public StringMatch[] MatchPositions { get; set; }
        public string MatchingName { get; set; }   // value part of the KeyValuePair
    }

    public class AutoCompleteResult
    {
        public object Value { get; set; }
        public StringMatch[] MatchPositions { get; set; }
        public string Text { get; set; }
    }

    public class AutocompleteEntryList : List<AutocompleteEntry>
    {
        public static string[] SEPARATORS = { "-", " ", "," };
        public void Add(object value, string name, int tieBreaker = 0)
        {
            AutocompleteEntry info = new AutocompleteEntry()
            {
                Value = value,
                DisplayText = name,
                SearchText = name.ToLower().RemoveDiacritics(),
                TieBreaker = tieBreaker
            };

            info.Words = info.SearchText.Split(SEPARATORS, StringSplitOptions.RemoveEmptyEntries);

            this.Add(info);
        }
    }
}
