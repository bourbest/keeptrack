using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using Common.Types;
using Common.Types.Autocomplete;

class SimpleClass
{
    public SimpleClass() { }
    public SimpleClass value { get; set; }
    public KeyValuePair<string, int> keypair { get; set; }
}

namespace Common.Types.Test
{

    [TestClass]
    public class ExpressionUtilsTest
    {
        [TestMethod]
        public void Expression_utils_get_type_with_basic_type()
        {
            Type type = ExpressionsUtils.GetPropertyType<AutocompleteEntry, object>(o => o.TieBreaker);

            Assert.AreEqual(typeof(int), type);
        }

        [TestMethod]
        public void Expression_utils_get_type_with_class()
        {
            Type type = ExpressionsUtils.GetPropertyType<SimpleClass, object>(o => o.value);

            Assert.AreEqual(typeof(SimpleClass), type);
        }

        [TestMethod]
        public void Expression_utils_get_type_with_template()
        {
            Type type = ExpressionsUtils.GetPropertyType<SimpleClass, object>(o => o.keypair);

            Assert.AreEqual(typeof(KeyValuePair<string, int>), type);
        }
    }
     
}
