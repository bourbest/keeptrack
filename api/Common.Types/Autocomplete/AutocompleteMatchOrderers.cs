using System;
using System.Collections.Generic;

namespace Common.Types.Autocomplete
{
    public class MatchPositionOrderer : IComparer<StringMatch>
    {
        public int Compare(StringMatch x, StringMatch y)
        {
            return x.Start - y.Start;
        }
    }

    public class AutocompletePriorityPositionOrderer : IComparer<AutocompleteMatch>
    {
        public virtual int Compare(AutocompleteMatch x, AutocompleteMatch y)
        {
            int res = x.Entry.TieBreaker - y.Entry.TieBreaker;

            if (res == 0)
                res = x.MatchPositions[0].Start - y.MatchPositions[0].Start;

            for (int i = 1; res == 0 && i < x.MatchPositions.Length && i < y.MatchPositions.Length; i++)
                res = x.MatchPositions[i].Start - y.MatchPositions[i].Start;

            if (res == 0)
                res = x.MatchPositions.Length - y.MatchPositions.Length;

            return res;
        }
    }

    public class AutocompleteMatchPositionOrderer : IComparer<AutocompleteMatch>
    {
        public virtual int Compare(AutocompleteMatch x, AutocompleteMatch y)
        {
            int res = x.MatchPositions[0].Start - y.MatchPositions[0].Start;

            for (int i = 1; res == 0 && i < x.MatchPositions.Length && i < y.MatchPositions.Length; i++)
                res = x.MatchPositions[i].Start - y.MatchPositions[i].Start;

            if (res == 0)
                res = x.MatchPositions.Length - y.MatchPositions.Length;

            if (res == 0)
                res = x.Entry.TieBreaker - y.Entry.TieBreaker;

            return res;
        }
    }

    public class AutocompleteMatchAlphaOrderer : IComparer<AutocompleteMatch>
    {
        public virtual int Compare(AutocompleteMatch x, AutocompleteMatch y)
        {
            return x.MatchingName.CompareTo(y.MatchingName);
        }
    }
}
