using System;
using Common.Domain;
using KT.Data.Models;
using KT.Data.Repositories;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace KT.Domain
{
    public class EvolutionNoteService : ServiceBase<Guid, EvolutionNoteRepository, EvolutionNote>
    {
        private readonly IKTDomainContext _context;
        public EvolutionNoteService(IKTDomainContext ctx) : 
            base(ctx.Uow, ctx.Uow.EvolutionNotes, ctx)
        {
            _context = ctx;
        }

        public override async Task AddEntityAsync(EvolutionNote newEntity)
        {
            ClientFile file = await _context.Uow.ClientFiles.FindByIdAsync(newEntity.ClientId);
            if (file == null)
                throw new EntityNotFoundException("ClientFile", newEntity.ClientId);

            newEntity.OwnerId = new Guid(_context.CurrentUser.Id);
            newEntity.AuthorName = _context.CurrentUser.Name;
            newEntity.AuthorRole = "TODO";
            await base.AddEntityAsync(newEntity);
        }

        public Task<List<EvolutionNote>> GetByClientId(Guid clientId)
        {
            return _context.Uow.EvolutionNotes.FindByClientId(clientId);
        }
    }
}
