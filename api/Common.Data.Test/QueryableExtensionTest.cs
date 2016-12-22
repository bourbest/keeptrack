using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

using Microsoft.VisualStudio.TestTools.UnitTesting;

using Common.Data;


namespace Common.Utils.TestUnits
{
    #region types utilisés pour tester
    // Classe de base avec un attribut du même nom avec une casse différente (ouais, c'est un test important)
    internal class BaseTestClass
    {
        public long Id { get; set; }
    }

    internal class TestClass : BaseTestClass
    {
        public long id { get; set; }
        public string Str { get; set; }
        public Int16 Int16 { get; set; }
        public int Int32 { get; set; }
        public long Int64 { get; set; }
        public UInt16 UInt16 { get; set; }
        public UInt32 UInt32 { get; set; }
        public UInt64 UInt64 { get; set; }
        public bool Bool { get; set; }
        public DateTime DateTime { get; set; }
        public char Char { get; set; }
    }
    #endregion

    [TestClass]
    public class QueryableExtensionTest
    {
        private ObservableCollection<TestClass> _data;
        IQueryable<TestClass> _query;
        private static string[] _numberProperties = { "Int16", "Int32", "Int64", "UInt16", "UInt32", "UInt64" };

        [TestInitialize]
        public void TestInitialize()
        {
            _data = new ObservableCollection<TestClass>();
            _query = _data.AsQueryable();

            for (int i = 0; i < 5; i++)
            {
                TestClass o = new TestClass();
                o.Bool = true;
                o.Char = (char)('a' + i);
                o.DateTime = new DateTime(2014, 05, 1 + i);
                o.id = Convert.ToInt64(i + ( (i % 2) * 100));
                o.Id = Convert.ToInt64(i);
                o.Int16 = Convert.ToInt16(i);
                o.Int32 = i;
                o.Int64 = Convert.ToInt64(i);
                o.UInt16 = Convert.ToUInt16(i);
                o.UInt32 = Convert.ToUInt32(i);
                o.UInt64 = Convert.ToUInt64(i);
                o.Str = "Test_" + i.ToString();

                _data.Add(o);
            }
        }

   #region Filter 
        [TestMethod]
        [TestCategory("Filter")]
        public void LinqExt_Filter_StringFromString_Success()
        {
            List<TestClass> list = _query.Filter<TestClass>("Str", "Test_1").ToList();
            Assert.AreEqual(list.Count, 1);
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void LinqExt_Filter_BoolFromString_Success()
        {
            List<TestClass> list = _query.Filter<TestClass>("Bool", "true").ToList();
            Assert.AreEqual(list.Count, 5);
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void LinqExt_Filter_NumberFromString_Success()
        {
            foreach (string str in _numberProperties)
            {
                List<TestClass> list = _query.Filter<TestClass>(str, "1").ToList();
                Assert.AreEqual(list.Count, 1);
            }
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void LinqExt_Filter_DateTimeFromString_Success()
        {
            List<TestClass> list = _query.Filter<TestClass>("DateTime", "2014-05-01").ToList();
            Assert.AreEqual(list.Count, 1);
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void TestFilter_CharFromString_Success()
        {
            List<TestClass> list = _query.Filter<TestClass>("Char", "a").ToList();
            Assert.AreEqual(list.Count, 1);
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void TestFilter_AmbiguousFromString_Success()
        {
            List<TestClass> list = _query.Filter<TestClass>("id", "0").ToList();
            Assert.AreEqual(list.Count, 1);
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void TestFilter_NotSupported_ThrowsArgumentException()
        {
            try
            {
                List<TestClass> list = _query.Filter<TestClass>("bouette", "0").ToList();
            }
            catch (ArgumentException ex)
            {
                Assert.AreEqual("filterName", ex.ParamName);
            }
        }

        [TestMethod]
        [TestCategory("Filter")]
        public void TestFilter_InvalidFilterValue_ThrowsArgumentException()
        {
            try
            {
                List<TestClass> list = _query.Filter<TestClass>("id", "allo").ToList();
            }
            catch (ArgumentException ex)
            {
                Assert.AreEqual("filterValue", ex.ParamName);
            }
        }

        #endregion

   #region SortBy tests
        [TestMethod]
        [TestCategory("OrderBy")]
        public void LinqExt_SortByStringAscending_Success()
        {
            List<TestClass> expected = _query.OrderBy(p => p.id).ToList();
            List<TestClass> list = _query.OrderBy("id").ToList();

            for (int i = 0; i < expected.Count; i++)
            {
                Assert.ReferenceEquals(expected[i], list[i]);
            }
        }

        [TestMethod]
        [TestCategory("OrderBy")]
        public void LinqExt_SortByStringDescending_Success()
        {
            List<TestClass> expected = _query.OrderByDescending(p => p.id).ToList();
            List<TestClass> list = _query.OrderByDescending("id").ToList();

            for (int i = 0; i < expected.Count; i++)
            {
                Assert.ReferenceEquals(expected[i], list[i]);
            }
        }

        [TestMethod]
        [TestCategory("OrderBy")]
        public void LinqExt_SortByStringInvalidProperty_ThrowsArgumentException()
        {
            SortByNotSupportedException thrownEx = null;
            try
            {
                List<TestClass> list = _query.OrderByDescending("bouette").ToList();
            }
            catch (SortByNotSupportedException ex)
            {
                thrownEx = ex;
            }

            Assert.IsNotNull(thrownEx, "No exception was thrown");
            Assert.AreEqual("bouette", thrownEx.Property, "'Property' was not set as expected on thrown exception");
        }

    #endregion

    }
}
