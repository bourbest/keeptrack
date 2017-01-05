using System;

using Common.Domain;

using KT.Data.Models;
using KT.Data.Repositories;


namespace KT.Domain
{
    public class ClientFileService : ServiceBase<Guid, ClientFileRepository, ClientFile>
    {

        public ClientFileService(IKTDomainContext ctx) : 
            base(ctx.Uow, ctx.Uow.ClientFiles)
        {
        }

    }
}
