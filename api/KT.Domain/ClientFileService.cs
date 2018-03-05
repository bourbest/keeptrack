using System;
using Common.Domain;
using KT.Data.Models;
using KT.Data.Repositories;

namespace KT.Domain
{
    public class ClientFileService : ServiceBase<Guid, ClientFileRepository, ClientFile>
    {
        private readonly IKTDomainContext _context;
        public ClientFileService(IKTDomainContext ctx) : 
            base(ctx.Uow, ctx.Uow.ClientFiles, ctx)
        {
            _context = ctx;
        }
    }
}
