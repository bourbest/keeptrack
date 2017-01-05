using System;
using KT.Data;
using KT.Data.Models;

namespace KT.Domain
{
    public interface IKTDomainContext
    {
        IKTUnitOfWork Uow { get; }

        UserIdentity CurrentUser { get; }

        DateTime TaskBeginTime { get; }
        DateTime CurrentTime { get; }
    }
}
