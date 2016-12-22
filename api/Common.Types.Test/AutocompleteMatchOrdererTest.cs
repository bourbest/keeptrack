using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

using Common.Types.Autocomplete;

namespace Common.Types.Test
{
    [TestClass]
    public class AutocompleteMatchOrdererTest
    {
        private AutocompleteMatchPositionOrderer _order = new AutocompleteMatchPositionOrderer();

        [TestMethod]
        public void LocalisationMatchOrderer_lhs_smaller_than_rhs()
        {

            AutocompleteEntry info = new AutocompleteEntry();
            AutocompleteMatch match1 = new AutocompleteMatch();
            match1.MatchPositions = new StringMatch[2];
            match1.MatchPositions[0] = new StringMatch() { Start = 4 };
            match1.MatchPositions[1] = new StringMatch() { Start = 8 };
            match1.Entry = info;

            AutocompleteMatch match2 = new AutocompleteMatch();
            match2.MatchPositions = new StringMatch[2];
            match2.MatchPositions[0] = new StringMatch() { Start = 4 };
            match2.MatchPositions[1] = new StringMatch() { Start = 9 };
            match2.Entry = info;

            int res = _order.Compare(match1, match2);

            Assert.AreEqual(-1, res);
        }

        [TestMethod]
        public void LocalisationMatchOrderer_lhs_greater_than_rhs()
        {
            AutocompleteEntry info = new AutocompleteEntry();
            AutocompleteMatch match1 = new AutocompleteMatch();

            match1.MatchPositions = new StringMatch[2];
            match1.MatchPositions[0] = new StringMatch() { Start = 4 };
            match1.MatchPositions[1] = new StringMatch() { Start = 8 };
            match1.Entry = info;

            AutocompleteMatch match2 = new AutocompleteMatch();
            match2.MatchPositions = new StringMatch[2];
            match2.MatchPositions[0] = new StringMatch() { Start = 4 };
            match2.MatchPositions[1] = new StringMatch() { Start = 9 };
            match2.Entry = info;

            int res = _order.Compare(match2, match1);

            Assert.AreEqual(1, res);
        }

        [TestMethod]
        public void LocalisationMatchOrderer_sort()
        {
            AutocompleteEntry info = new AutocompleteEntry();
            AutocompleteMatch match1 = new AutocompleteMatch();

            match1.MatchPositions = new StringMatch[2];
            match1.MatchPositions[0] = new StringMatch() { Start = 4 };
            match1.MatchPositions[1] = new StringMatch() { Start = 8 };
            match1.Entry = info;

            AutocompleteMatch match2 = new AutocompleteMatch();
            match2.MatchPositions = new StringMatch[2];
            match2.MatchPositions[0] = new StringMatch() { Start = 4 };
            match2.MatchPositions[1] = new StringMatch() { Start = 9 };
            match2.Entry = info;

            List<AutocompleteMatch> matches = new List<AutocompleteMatch>();
            matches.Add(match2);
            matches.Add(match1);

            // test
            matches.Sort(_order);

            //assert
            Assert.AreSame(matches[0], match1);
            Assert.AreSame(matches[1], match2);
        }

        [TestMethod]
        public void LocalisationMatchOrderer_lhsType_gt_rhsType()
        {
            AutocompleteEntry info = new AutocompleteEntry();
            AutocompleteMatch match1 = new AutocompleteMatch();

            match1.MatchPositions = new StringMatch[2];
            match1.MatchPositions[0] = new StringMatch() { Start = 4 };
            match1.MatchPositions[1] = new StringMatch() { Start = 9 };
            info.TieBreaker = 1;
            match1.Entry = info;

            AutocompleteEntry info2 = new AutocompleteEntry();
            AutocompleteMatch match2 = new AutocompleteMatch();

            match2.MatchPositions = new StringMatch[2];
            match2.MatchPositions[0] = new StringMatch() { Start = 4 };
            match2.MatchPositions[1] = new StringMatch() { Start = 9 };
            info2.TieBreaker = 2;
            match2.Entry = info2;

            List<AutocompleteMatch> matches = new List<AutocompleteMatch>();
            matches.Add(match2);
            matches.Add(match1);

            // test
            matches.Sort(_order);

            //assert
            Assert.AreSame(matches[0], match1);
            Assert.AreSame(matches[1], match2);
        }

        [TestMethod]
        public void LocalisationMatchOrderer_MatchPosition_Not_Same_Sizes()
        {
            AutocompleteEntry info = new AutocompleteEntry() ;
            AutocompleteMatch match1 = new AutocompleteMatch();

            match1.MatchPositions = new StringMatch[2];
            match1.MatchPositions[0] = new StringMatch() { Start = 4 };
            match1.MatchPositions[1] = new StringMatch() { Start = 9 };
            match1.Entry = info;

            AutocompleteEntry info2 = new AutocompleteEntry();
            AutocompleteMatch match2 = new AutocompleteMatch();

            match2.MatchPositions = new StringMatch[1];
            match2.MatchPositions[0] = new StringMatch() { Start = 4 };
            match2.Entry = info2;

            List<AutocompleteMatch> matches = new List<AutocompleteMatch>();
            matches.Add(match2);
            matches.Add(match1);

            // test
            matches.Sort(_order);

            //assert
            Assert.AreSame(matches[0], match2);
            Assert.AreSame(matches[1], match1);
        }

        [TestMethod]
        public void LocalisationMatchOrderer_Mix_On_Second_Term()
        {
            AutocompleteEntry info = new AutocompleteEntry();
            AutocompleteMatch match1 = new AutocompleteMatch();
            info.TieBreaker = 4;
            match1.MatchPositions = new StringMatch[2];
            match1.MatchPositions[0] = new StringMatch() { Start = 5 };
            match1.MatchPositions[1] = new StringMatch() { Start = 0 };
            match1.Entry = info;

            AutocompleteEntry info2 = new AutocompleteEntry();
            AutocompleteMatch match2 = new AutocompleteMatch();
            info2.TieBreaker = 2;
            match2.MatchPositions = new StringMatch[2];
            match2.MatchPositions[0] = new StringMatch() { Start = 5 };
            match2.MatchPositions[1] = new StringMatch() { Start = 0 };
            match2.Entry = info2;

            AutocompleteEntry info3 = new AutocompleteEntry();
            AutocompleteMatch match3 = new AutocompleteMatch();

            match3.MatchPositions = new StringMatch[2];
            match3.MatchPositions[0] = new StringMatch() { Start = 8 };
            match3.MatchPositions[1] = new StringMatch() { Start = 0 };
            match3.Entry = info3;

            AutocompleteEntry info4 = new AutocompleteEntry();
            AutocompleteMatch match4 = new AutocompleteMatch();

            match4.MatchPositions = new StringMatch[2];
            match4.MatchPositions[0] = new StringMatch() { Start = 4 };
            match4.MatchPositions[1] = new StringMatch() { Start = 0 };
            match4.Entry = info4;

            List<AutocompleteMatch> matches = new List<AutocompleteMatch>();
            matches.Add(match2);
            matches.Add(match1);
            matches.Add(match3);
            matches.Add(match4);

            // test
            matches.Sort(_order);

            //assert
            Assert.AreSame(matches[0], match4);
            Assert.AreSame(matches[1], match2);
            Assert.AreSame(matches[2], match1);
            Assert.AreSame(matches[3], match3);
        }
    }
}
