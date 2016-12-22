using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;

namespace Common.Data
{
    public sealed class SortByNotSupportedException : Exception
    {
        public string Property { get; private set; }

        public SortByNotSupportedException(string propertyName)
        {
            Property = propertyName;
        }

        public SortByNotSupportedException(string propertyName, string message)
            : base(message)
        {
            Property = propertyName;
        }
    }
}
