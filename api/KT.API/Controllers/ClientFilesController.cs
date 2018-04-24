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
    [RoutePrefix("client-files")]
    public class ClientFilesController : BaseApiController<Guid, ClientFile>
    {
        public ClientFilesController(IKTUnitOfWork uow) : base(uow) { }

        protected override ICRUDService<Guid, ClientFile> CreateServiceWithContext(IKTDomainContext ctx)
        {
            return new ClientFileService(_ctx);
        }

        [AllowAnonymous]
        [HttpOptions, Route]
        public string Options()
        {
            return base.DoOptions();
        }

        [HttpGet, Route("")]
        public Task<IHttpActionResult> List([ListQueryFromRequest] QueryParameters query)
        {
            return base.DoList(query);
        }

        [HttpGet, Route("{id}")]
        public Task<IHttpActionResult> Get(Guid id)
        {
            return base.DoGet(id);
        }

        [HttpGet, Route("{id}/documents")]
        [ClaimsAuthorize(Permission = AppRoles.CAN_INTERACT_WITH_CLIENTS)]
        public async Task<IHttpActionResult> GetDocuments(Guid id)
        {
            using (ClientDocumentService svc = new ClientDocumentService(_ctx))
            {
                var documents = await svc.GetClientDocuments(id);
                return Ok(documents);
            }
        }

        [HttpGet, Route("{id}/evolution-notes")]
        public async Task<IHttpActionResult> GetEvolutionNotes(Guid id)
        {
            using (EvolutionNoteService svc = new EvolutionNoteService(_ctx))
            {
                var documents = await svc.GetByClientId(id);
                return Ok(documents);
            }
        }

        // POST api/{entity}
        [HttpPost, Route]
        [ClaimsAuthorize(Permission = AppRoles.CAN_INTERACT_WITH_CLIENTS)]
        public Task<IHttpActionResult> Post([FromBody] ClientFile newEntity)
        {
            return DoPost(newEntity);
        }

        // PUT api/{entity}
        [HttpPut, Route("{id}")]
        [ClaimsAuthorize(Permission = AppRoles.CAN_INTERACT_WITH_CLIENTS)]
        public Task<IHttpActionResult> Put(Guid id, ClientFile entity)
        {
            return DoPut(id, entity);
        }

        // DELETE api/{entity}/{id}
        [HttpDelete, Route("{id}")]
        [ClaimsAuthorize(Permission = AppRoles.CAN_INTERACT_WITH_CLIENTS)]
        public Task<IHttpActionResult> Delete(Guid id)
        {
            return DoDelete(id);
        }

        [HttpDelete]
        [Route("")]
        [ClaimsAuthorize(Permission = AppRoles.CAN_INTERACT_WITH_CLIENTS)]
        public Task<IHttpActionResult> Delete([FromBody] Guid[] ids)
        {
            return DoDelete(ids);
        }

    }

}
