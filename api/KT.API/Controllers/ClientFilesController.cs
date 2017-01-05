using System;
using System.Threading.Tasks;
using System.Web.Http;

using Common.Domain;

using KT.Data;
using KT.Data.Models;
using KT.Domain;


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
        public Task<IHttpActionResult> List()
        {
            return base.DoList();
        }

        [HttpGet, Route("{id}")]
        public Task<IHttpActionResult> Get(Guid id)
        {
            return base.DoGet(id);
        }

        // POST api/{entity}
        [HttpPost, Route]
        public Task<IHttpActionResult> Post([FromBody] ClientFile newEntity)
        {
            return DoPost(newEntity);
        }

        // PUT api/{entity}
        [HttpPut, Route("{id}")]
        public Task<IHttpActionResult> Put(Guid id, ClientFile entity)
        {
            return DoPut(id, entity);
        }

        // DELETE api/{entity}/{id}
        [HttpDelete, Route("{id}")]
        public Task<IHttpActionResult> Delete(Guid id)
        {
            return DoDelete(id);
        }

        [HttpDelete]
        [Route("")]
        public Task<IHttpActionResult> Delete([FromBody] Guid[] ids)
        {
            return DoDelete(ids);
        }

    }

}
