using System;
using KT.Data;
using KT.Data.Models;
using Common.Domain;

namespace KT.Domain
{
    public interface IKTDomainContext : IServiceContext
    {
        IKTUnitOfWork Uow { get; }

        UserIdentity CurrentUser { get; }
    }
}
