using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

using Common.Types;
using Common.Types.Autocomplete;

namespace Common.Types.Test
{
    [TestClass]
    public class AliasDictionaryTest
    {
        #region Throwing test cases
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void Abreviation_larger_than_word_throws()
        {
            AliasDictionary dict = new AliasDictionary();
            dict.AddAlias("abcd", "abcd");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void Abreviation_larger_than_words_throws()
        {
            AliasDictionary dict = new AliasDictionary();
            dict.AddAlias("abcd", new string[] { "abcd" });
        }

        #endregion

        [TestMethod]
        public void AddAlias_creates_words_decomposition_tree()
        {
            AliasDictionary dict = new AliasDictionary();
            dict.AddAlias("ch.", "chemin");

            // verify
            HashSet<string> words = dict["ch."];
            Assert.AreEqual(1, words.Count);
            Assert.IsTrue(words.Contains("chemin"));

            Assert.IsFalse(dict.TryGetValue("c", out words));
            Assert.IsFalse(dict.TryGetValue("ch", out words));

            Assert.IsTrue(dict.TryGetValue("che", out words));
            Assert.AreEqual(1, words.Count);
            Assert.IsTrue(words.Contains("ch."));

            Assert.IsTrue(dict.TryGetValue("chem", out words));
            Assert.AreEqual(1, words.Count);
            Assert.IsTrue(words.Contains("ch."));

            Assert.IsTrue(dict.TryGetValue("chemi", out words));
            Assert.AreEqual(1, words.Count);
            Assert.IsTrue(words.Contains("ch."));

            Assert.IsTrue(dict.TryGetValue("chemin", out words));
            Assert.AreEqual(1, words.Count);
            Assert.IsTrue(words.Contains("ch."));
        }

        [TestMethod]
        public void AddAlias_merges_words_decomposition_trees()
        {
            AliasDictionary dict = new AliasDictionary();
            dict.AddAlias("st", new string[] { "saint", "sainte" });
            dict.AddAlias("ste", new string[] { "sainte", "saint" });

            // verify
            HashSet<string> words = dict["st"];
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("saint"));
            Assert.IsTrue(words.Contains("sainte"));

            words = dict["ste"];
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("saint"));
            Assert.IsTrue(words.Contains("sainte"));

            Assert.IsFalse(dict.TryGetValue("s", out words));

            Assert.IsTrue(dict.TryGetValue("sa", out words));
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("st"));
            Assert.IsTrue(words.Contains("ste"));


            Assert.IsTrue(dict.TryGetValue("sai", out words));
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("st"));
            Assert.IsTrue(words.Contains("ste"));


            Assert.IsTrue(dict.TryGetValue("sain", out words));
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("st"));
            Assert.IsTrue(words.Contains("ste"));


            Assert.IsTrue(dict.TryGetValue("saint", out words));
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("st"));
            Assert.IsTrue(words.Contains("ste"));

            Assert.IsTrue(dict.TryGetValue("sainte", out words));
            Assert.AreEqual(2, words.Count);
            Assert.IsTrue(words.Contains("st"));
            Assert.IsTrue(words.Contains("ste"));
        }
    }
}
