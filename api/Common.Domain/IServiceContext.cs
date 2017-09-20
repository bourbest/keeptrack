using Common.Data;
using System;

namespace Common.Domain
{
    public interface IServiceContext
    {
        DateTime TaskBeginTime { get; }
        DateTime CurrentTime { get; }
    }
}