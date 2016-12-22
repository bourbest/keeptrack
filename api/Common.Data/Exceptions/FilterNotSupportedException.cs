using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;

namespace Common.Data
{
    public sealed class FilterNotSupportedException : Exception
    {
        public string Filter { get; private set; }

        public FilterNotSupportedException(string filterName)
        {
            Filter = filterName;
        }

        public FilterNotSupportedException(string filterName, string message)
            : base(message)
        {
            Filter = filterName;
        }
    }
}
