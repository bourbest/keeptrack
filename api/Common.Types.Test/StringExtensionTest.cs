using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using Common.Types;

namespace Common.Types.Test
{

    [TestClass]
    public class StringExtensionTest
    {
        [TestMethod]
        public void StringExtension_RemoveLeadingChars_with_char_array()
        {
            string value = "   ,test   ,";
            string ret = value.RemoveLeadingChars(new char[] { ' ', ',' });
            Assert.AreEqual("test   ,", ret);
        }


        [TestMethod]
        public void StringExtension_RemoveLeadingChars_with_string()
        {
            string value = "   ,test   ,";
            string ret = value.RemoveLeadingChars(" ,");
            Assert.AreEqual("test   ,", ret);
        }
    }
     
}
