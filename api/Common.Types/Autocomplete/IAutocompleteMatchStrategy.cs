using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Autocomplete
{
    public interface IAutocompleteMatchStrategy
    {
        IEnumerable<AutocompleteMatch> GetMatches(string matchValue,
                                                 IEnumerable<AutocompleteEntry> entries,
                                                 AliasDictionary aliasDict = null);

        bool CanRefine { get; }
    }
}
