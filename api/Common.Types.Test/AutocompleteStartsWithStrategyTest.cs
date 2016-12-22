using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

using Common.Types;
using Common.Types.Autocomplete;

namespace Common.Types.Test
{
    [TestClass]
    public class AutocompleteStartsWithStragegyTests
    {
        #region Throwing test cases
        [TestMethod]
        public void StartsWithStrategy_with_null_string()
        {
            ArgumentNullException ex = null;
            AutocompleteEntry[] entries = new AutocompleteEntry[0];
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            try
            {
                engine.GetMatches(null, entries);
            }
            catch (ArgumentNullException argEx)
            {
                ex = argEx;
            }

            Assert.IsNotNull(ex);
            Assert.AreEqual("matchValue", ex.ParamName);
        }

        [TestMethod]
        public void StartsWithStrategy_with_empty_string()
        {
            ArgumentNullException ex = null;
            AutocompleteEntry[] entries = new AutocompleteEntry[0];
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            try
            {
                engine.GetMatches(string.Empty, entries);
            }
            catch (ArgumentNullException argEx)
            {
                ex = argEx;
            }

            Assert.IsNotNull(ex);
            Assert.AreEqual("matchValue", ex.ParamName);
        }

        [TestMethod]
        public void StartsWithStrategy_with_null_entries()
        {
            ArgumentNullException ex = null;
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            try
            {
                engine.GetMatches("test", null);
            }
            catch (ArgumentNullException argEx)
            {
                ex = argEx;
            }

            Assert.IsNotNull(ex);
            Assert.AreEqual("entries", ex.ParamName);
        }
        #endregion



        [TestMethod]
        public void StartsWithStrategy_with_empty_entries_returns_empty_list()
        {
            AutocompleteEntryList entries = new AutocompleteEntryList();
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("test", entries);

            Assert.AreEqual(0, results.Count());
        }

        [TestMethod]
        public void StartsWithStrategy_matching_one_name_of_one_entry()
        {
            // prepare
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();

            entries.Add(testValue, "St-Michel");
            entries.Add(testValue, "Montreal");

            //test
            IEnumerable<AutocompleteMatch> results = engine.GetMatches("st", entries);

            //assert
            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match = results.First();
            Assert.AreEqual(1, match.MatchPositions.Length, "Match.MatchPositions.Lenght not as expected");
            Assert.AreEqual("St-Michel", match.MatchingName, "MatchingName value not as expected");
            Assert.AreEqual(0, match.MatchPositions[0].Start, "Match.Start not as expected");
        }

        [TestMethod]
        public void StartsWithStrategy_matching_two_entries_are_ordered()
        {
            // prepare
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "G2E 4L7");
            entries.Add(testValue, "G2E 1K0");
            entries.Add(testValue, "G1K 1L0");
            entries.Add(testValue, "G2E 1V3");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("G2E", entries);

            Assert.AreEqual(3, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            AutocompleteMatch match2 = results.ToArray()[1];
            AutocompleteMatch match3 = results.Last();
            Assert.AreEqual("G2E 1K0", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("G2E 1V3", match2.MatchingName, "Match[1].Value not as expected");
            Assert.AreEqual(0, match2.MatchPositions[0].Start, "Match[1].Start not as expected");
            Assert.AreEqual("G2E 4L7", match3.MatchingName, "Match[2].Value not as expected");
            Assert.AreEqual(0, match3.MatchPositions[0].Start, "Match[2].Start not as expected");
        }

        [TestMethod]
        public void StartsWithStrategy_alias_matching_bigger_word_works()
        {
            // prepare
            AliasDictionary aliasDict = new AliasDictionary();
            aliasDict.AddAlias("st", "saint");
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "Saint-Michel");
            entries.Add(testValue, "sherbrooke");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("st", entries, aliasDict);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("Saint-Michel", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("saint", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
        }

        [TestMethod]
        public void StartsWithStrategy_alias_matching_smaller_word_works()
        {
            // prepare
            AliasDictionary aliasDict = new AliasDictionary();
            aliasDict.AddAlias("st", "saint");
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "St-Michel");
            entries.Add(testValue, "sherbrooke");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("saint", entries, aliasDict);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("St-Michel", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("st", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
        }

        [TestMethod]
        public void StartsWithStrategy_is_case_insensitive()
        {
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "montreal");
            entries.Add(testValue, "sherbrooke");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("Montreal", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("montreal", match1.MatchingName, "MatchingName value not as expected");
        }

        [TestMethod]
        public void StartsWithStrategy_is_diatrics_agnostic_on_search_string()
        {
            MatchStartsWithStrategy engine = new MatchStartsWithStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "Montreal" );
            entries.Add(testValue, "sherbrooke" );

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("Montréal", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("Montreal", match1.MatchingName, "MatchingName value not as expected");
        }
    }
}
