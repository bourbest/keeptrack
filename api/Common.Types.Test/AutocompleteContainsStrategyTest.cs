using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

using Common.Types;
using Common.Types.Autocomplete;

namespace Common.Types.Test
{
    [TestClass]
    public class ContainsStrategyTest
    {
        #region Throwing test cases
        [TestMethod]
        public void ContainsStrategy_with_null_string()
        {
            ArgumentNullException ex = null;
            AutocompleteEntry[] entries = new AutocompleteEntry[0];
            MatchContainsStrategy engine = new MatchContainsStrategy();
            try
            {
                engine.GetMatches(null, entries);
            } catch(ArgumentNullException argEx)
            {
                ex = argEx;
            }

            Assert.IsNotNull(ex);
            Assert.AreEqual("matchValue", ex.ParamName);
        }

        [TestMethod]
        public void ContainsStrategy_with_empty_string()
        {
            ArgumentNullException ex = null;
            AutocompleteEntry[] entries = new AutocompleteEntry[0];
            MatchContainsStrategy engine = new MatchContainsStrategy();
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
        public void ContainsStrategy_with_null_localisations()
        {
            ArgumentNullException ex = null;
            MatchContainsStrategy engine = new MatchContainsStrategy();
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
        public void ContainsStrategy_with_empty_entries_returns_empty_list()
        {
            AutocompleteEntryList entries = new AutocompleteEntryList();
            MatchContainsStrategy engine = new MatchContainsStrategy();

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("test", entries);

            Assert.AreEqual(0, results.Count());
        }

        [TestMethod]
        public void AutocompleteEntryList_Add_removes_diatrics_and_converts_to_lowercase()
        {
            AutocompleteEntryList entries = new AutocompleteEntryList();
            string testValue = "test";

            entries.Add(testValue, "Québec"); 

            Assert.AreEqual(1, entries.Count);
            AutocompleteEntry first = entries.First();
            Assert.AreEqual(testValue, first.Value);
            Assert.AreEqual("quebec", first.SearchText);
            Assert.AreEqual("Québec", first.DisplayText);
        }

        [TestMethod]
        public void ContainsStrategy_with_one_value_matching_one_name_of_one_localisation()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
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
        public void ContainsStrategy_with_one_value_matching_two_localisations_are_ordered()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "Montreal");
            entries.Add(testValue, "sherbrooke");
            entries.Add(testValue, "ville de québec");
            entries.Add(testValue, "québec (agglomération)");
            entries.Add(testValue, "rue du capitaine");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("québec", entries);

            Assert.AreEqual(2, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            AutocompleteMatch match2 = results.Last();
            Assert.AreEqual("québec (agglomération)", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("ville de québec", match2.MatchingName, "MatchingName value not as expected");
            Assert.AreEqual(9, match2.MatchPositions[0].Start, "Match[0].Start not as expected");
        }

        [TestMethod]
        public void ContainsStrategy_with_three_values_match_sequence_are_ordered()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "fa fe fi fo fu");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("fo fu fe", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual(3, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual(9, match1.MatchPositions[1].Start, "Match[1].Start not as expected");
            Assert.AreEqual(12, match1.MatchPositions[2].Start, "Match[2].Start not as expected");
        }

        [TestMethod]
        public void ContainsStrategy_with_many_match_merge_overlap_bigger()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "farfadet");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("fa far", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual(1, match1.MatchPositions.Length, "MatchPosition.Length not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("far", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
        }

        [TestMethod]
        public void ContainsStrategy_with_many_match_merge_overlap_smaller()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "farfadet");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("far fa", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual(1, match1.MatchPositions.Length, "MatchPosition.Length not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("far", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
        }

        [TestMethod]
        public void ContainsStrategy_with_many_match_merge_overlap_equal()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "farfadet");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("far far", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual(1, match1.MatchPositions.Length, "MatchPosition.Length not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("far", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
        }

        [TestMethod]
        public void ContainsStrategy_alias_matching_bigger_word_works()
        {
            // prepare
            AliasDictionary aliasDict = new AliasDictionary();
            aliasDict.AddAlias("st", "saint");
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "Saint-Michel");
            entries.Add(testValue, "sherbrooke");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("st-", entries, aliasDict );

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("Saint-Michel", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("saint", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
        }

        [TestMethod]
        public void ContainsStrategy_alias_matching_bigger_word_works_with_dot()
        {
            // prepare
            AliasDictionary aliasDict = new AliasDictionary();
            aliasDict.AddAlias("ch.", "chemin");

            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "114 Ch. Sainte-Foy");
            entries.Add(testValue, "114 rue sherbrooke");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("114 chem", entries, aliasDict);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("114 Ch. Sainte-Foy", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("114", match1.MatchPositions[0].Value, "Match[0].Value not as expected");
            Assert.AreEqual("ch.", match1.MatchPositions[1].Value, "Match[1].Value not as expected");

        }

        [TestMethod]
        public void ContainsStrategy_alias_matching_smaller_word_works()
        {
            // prepare
            AliasDictionary aliasDict = new AliasDictionary();
            aliasDict.AddAlias("st", "saint");
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "St-Michel");
            entries.Add(testValue, "sherbrooke" );

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("saint", entries, aliasDict);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("St-Michel", match1.MatchingName, "Match[0].Value not as expected");
            Assert.AreEqual(0, match1.MatchPositions[0].Start, "Match[0].Start not as expected");
            Assert.AreEqual("st", match1.MatchPositions[0].Value, "Match[0].Value not as expected");

        }

        [TestMethod]
        public void ContainsStrategy_is_case_insensitive()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
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
        public void ContainsStrategy_is_diatrics_agnostic_on_search_string()
        {
            // prepare
            MatchContainsStrategy engine = new MatchContainsStrategy();
            string testValue = "test";
            AutocompleteEntryList entries = new AutocompleteEntryList();
            entries.Add(testValue, "Montreal");
            entries.Add(testValue, "sherbrooke");

            IEnumerable<AutocompleteMatch> results = engine.GetMatches("Montréal", entries);

            Assert.AreEqual(1, results.Count(), "didn't match has many as expected");
            AutocompleteMatch match1 = results.First();
            Assert.AreEqual("Montreal", match1.MatchingName, "MatchingName value not as expected");
        }
    }
}
