using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Threading.Tasks;

using Common.Types;
using Common.Types.Autocomplete;

namespace Common.API
{

    public class AutocompleteWebSocketImpl : IWebSocket
    {
        private IAutocompleteMatchStrategy  _engine = null;

        private AliasDictionary _aliases = null;
        private IEnumerable<AutocompleteEntry> _allEntries = null;
        private IEnumerable<AutocompleteEntry> _lastEntries = null;
        private string _lastFilter = null;
        private int _limitReturned = 20;

        public AutocompleteWebSocketImpl(IEnumerable<AutocompleteEntry> entries,
                                          AliasDictionary aliases,
                                          int limitReturned,
                                          IAutocompleteMatchStrategy matchStrategy = null)
        {
            _allEntries = entries;
            _aliases = aliases;
            _limitReturned = limitReturned;

            if (matchStrategy == null)
                matchStrategy = new MatchContainsStrategy();

            _engine = matchStrategy;
        }

        public string OnOpen()
        {
            return null;
        }

        public IEnumerable<AutoCompleteResult> GetResults(string message)
        {
            IEnumerable<AutocompleteEntry> entries = _allEntries;
            IEnumerable<AutoCompleteResult> ret = null;

            if (message != null && message.Length > 0)
            {
                if (_lastFilter != null && message.Length > _lastFilter.Length && message.StartsWith(_lastFilter))
                    entries = _lastEntries;

                IEnumerable<AutocompleteMatch> matches = _engine.GetMatches(message, entries, _aliases);

                ret = matches.Take(_limitReturned).Select(m => new AutoCompleteResult()
                {
                    Value = m.Entry.Value,
                    Text = m.MatchingName,
                    MatchPositions = m.MatchPositions
                });
                _lastFilter = message;
                _lastEntries = matches.Select(o => o.Entry);
            }
            else
                ret = new List<AutoCompleteResult>();

            return ret;
        }

        public string OnMessage(string message)
        {
            IEnumerable<AutoCompleteResult> results = GetResults(message);
            return JsonConvert.SerializeObject(results);
        }

        public void OnClose()
        {
            _lastEntries = null;
            _lastFilter = null;
        }

        public string OnError(string message = null, Exception ex = null)
        {
            return null;
        }

    }
}