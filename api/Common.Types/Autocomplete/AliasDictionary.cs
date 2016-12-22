using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Autocomplete
{
    public class AliasDictionary
    {
        public AliasDictionary()
        {
            _dict = new Dictionary<string, HashSet<string>>();
        }

        public void AddAlias(string abreviation, IEnumerable<string> words)
        {
            foreach (string word in words)
                AddAlias(abreviation, word);
        }

        public void AddAlias(string abreviation, string word)
        {
            if (abreviation.Length >= word.Length)
                throw new ArgumentException("Abreviation should be smaller than word");

            HashSet<string> words;
            if (_dict.TryGetValue(abreviation, out words) == false)
            {
                words = new HashSet<string>();
                _dict.Add(abreviation, words);
            }

            if (!words.Contains(word))
                words.Add(word);

            AddWordChunks(abreviation, word);
        }

        public HashSet<string> this[string key]
        {
            get { return _dict[key]; }
        }

        public bool TryGetValue(string key, out HashSet<string> value)
        {
            return _dict.TryGetValue(key, out value);
        }

        private void AddWordChunks(string abr, string word)
        {
            char[] abrChars = abr.ToArray();
            char[] wordChars = word.ToArray();

            int i = 0;
            while (i < abrChars.Length && abrChars[i] == wordChars[i])
                i++;

            for (; i < wordChars.Length; i++)
            {
                string key = new string(wordChars.Take(i+1).ToArray());
                HashSet<string> words;
                if (_dict.TryGetValue(key, out words) == false)
                {
                    words = new HashSet<string>();
                    _dict.Add(key, words);
                }
                if (!words.Contains(abr))
                    words.Add(abr);
            }
        }

        private Dictionary<string, HashSet<string>> _dict;
    }


}
