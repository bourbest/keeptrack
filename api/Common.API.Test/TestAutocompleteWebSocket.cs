using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using Newtonsoft.Json;
using Common.API;
using Common.Types.Autocomplete;

namespace Common.API.Test
{
    [TestClass]
    public class TestLocalisationWebSocket
    {
        [TestMethod]
        public void LocalisationsWS_EmptyString_returns_empty_array()
        {
            AutocompleteEntryList localisations = new AutocompleteEntryList();
            AliasDictionary aliases = new AliasDictionary();
            AutocompleteWebSocketImpl socket = new AutocompleteWebSocketImpl(localisations, aliases, 10);

            localisations.Add(null, "test"); 

            string ret = socket.OnMessage("");

            Assert.AreEqual("[]", ret);
        }

        [TestMethod]
        public void LocalisationsWS_matches_are_sorted_with_order_of_match()
        {
            AutocompleteEntryList localisations = new AutocompleteEntryList();
            AliasDictionary aliases = new AliasDictionary();
            AutocompleteWebSocketImpl socket = new AutocompleteWebSocketImpl(localisations, aliases, 10);

            localisations.Add(null, "Alpha test");
            localisations.Add(null, "Zeta testing"); //5, 0
            localisations.Add(null, "zeta in testing"); // 8,0
            localisations.Add(null, "alpha Test2");
            localisations.Add(null, "zetatest"); // 4, 0

            string json = socket.OnMessage("test zeta");

            List<AutoCompleteResult> results = JsonConvert.DeserializeObject<List<AutoCompleteResult>>(json);


            Assert.AreEqual(3, results.Count);
            Assert.AreEqual("zetatest", results[0].Text);
            Assert.AreEqual("Zeta testing", results[1].Text);
            Assert.AreEqual("zeta in testing", results[2].Text);
        }

        [TestMethod]
        public void LocalisationsWS_matches_are_sorted_with_type_when_1st_match_equal()
        {
            AutocompleteEntryList localisations = new AutocompleteEntryList();
            AliasDictionary aliases = new AliasDictionary();
            AutocompleteWebSocketImpl socket = new AutocompleteWebSocketImpl(localisations, aliases, 10);

            localisations.Add(null, "Zeta testing 1", 1); // 5, 0
            localisations.Add(null, "Zeta testing 2", 2); //5, 0
            localisations.Add(null, "zeta in testing"); // 8,0
            localisations.Add(null, "alpha Test2");
            localisations.Add(null, "zetatest"); // 4, 0

            string json = socket.OnMessage("test zeta");

            List<AutoCompleteResult> results = JsonConvert.DeserializeObject<List<AutoCompleteResult>>(json);

            Assert.AreEqual(4, results.Count);
            Assert.AreEqual("zetatest", results[0].Text);
            Assert.AreEqual("Zeta testing 1", results[1].Text);
            Assert.AreEqual("Zeta testing 2", results[2].Text);
            Assert.AreEqual("zeta in testing", results[3].Text);
        }

        [TestMethod]
        public void LocalisationsWS_limit_limits()
        {
            AutocompleteEntryList localisations = new AutocompleteEntryList();
            AliasDictionary aliases = new AliasDictionary();
            AutocompleteWebSocketImpl socket = new AutocompleteWebSocketImpl(localisations, aliases, 1);

            localisations.Add(null, "Zeta testing"); // 5, 0
            localisations.Add(null, "Zeta testing"); //5, 0
            localisations.Add(null, "zeta in testing"); // 8,0
            localisations.Add(null, "alpha Test2");
            localisations.Add(null, "zetatest"); // 4, 0

            string json = socket.OnMessage("test zeta");

            List<AutoCompleteResult> results = JsonConvert.DeserializeObject<List<AutoCompleteResult>>(json);

            Assert.AreEqual(1, results.Count);
            Assert.AreEqual("zetatest", results[0].Text);
        }
    }
}
