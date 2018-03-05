using System;
using Common.Domain;
using KT.Data.Models;
using KT.Data.Repositories;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace KT.Domain
{
    public class ClientDocumentService : ServiceBase<Guid, ClientDocumentRepository, ClientDocument>
    {
        private readonly IKTDomainContext _context;
        public ClientDocumentService(IKTDomainContext ctx) : 
            base(ctx.Uow, ctx.Uow.ClientDocuments, ctx)
        {
            _context = ctx;
        }

        public Task<List<ClientDocument>> GetClientDocuments(Guid clientId)
        {
            return _context.Uow.ClientDocuments.FindByClientId(clientId);
        }
    }
}
