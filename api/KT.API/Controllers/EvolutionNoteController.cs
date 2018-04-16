using System;
using System.Threading.Tasks;
using System.Web.Http;

using Common.Domain;

using KT.Data;
using KT.Data.Models;
using KT.Domain;
using Common.API;
using Common.Types;

namespace KT.API.Controllers
{
    [Authorize]
    [RoutePrefix("evolution-notes")]
    public class EvolutionNoteController : BaseApiController<Guid, EvolutionNote>
    {
        public EvolutionNoteController(IKTUnitOfWork uow) : base(uow) { }

        protected override ICRUDService<Guid, EvolutionNote> CreateServiceWithContext(IKTDomainContext ctx)
        {
            return new EvolutionNoteService(_ctx);
        }

        [AllowAnonymous]
        [HttpOptions, Route]
        public string Options()
        {
            return base.DoOptions();
        }

        [HttpGet, Route("{id}")]
        public Task<IHttpActionResult> Get(Guid id)
        {
            return base.DoGet(id);
        }

        // POST api/{entity}
        [HttpPost, Route()]
        public Task<IHttpActionResult> Post(EvolutionNote newEntity)
        {
            return DoPost(newEntity);
        }
    }

}
