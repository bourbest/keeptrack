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
    [RoutePrefix("client-documents")]
    public class ClientDocumentController : BaseApiController<Guid, ClientDocument>
    {
        public ClientDocumentController(IKTUnitOfWork uow) : base(uow) { }

        protected override ICRUDService<Guid, ClientDocument> CreateServiceWithContext(IKTDomainContext ctx)
        {
            return new ClientDocumentService(_ctx);
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
        public Task<IHttpActionResult> Post(ClientDocument newEntity)
        {
            return DoPost(newEntity);
        }

        // PUT api/{entity}
        [HttpPut, Route("{id}")]
        public Task<IHttpActionResult> Put(Guid id, ClientDocument entity)
        {
            return DoPut(id, entity);
        }
    }

}
