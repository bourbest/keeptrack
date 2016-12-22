using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;

namespace Common.Data
{
    public sealed class InvalidFilterValueException : Exception
    {
        public string Filter { get; private set; }

        public InvalidFilterValueException(string filterName)
        {
            Filter = filterName;
        }

        public InvalidFilterValueException(string filterName, string message)
            : base(message)
        {
            Filter = filterName;
        }
    }
}
