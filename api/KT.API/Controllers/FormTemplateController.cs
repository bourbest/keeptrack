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
    [RoutePrefix("form-templates")]
    public class FormTemplateController : BaseApiController<Guid, FormTemplate>
    {
        public FormTemplateController(IKTUnitOfWork uow) : base(uow) { }

        protected override ICRUDService<Guid, FormTemplate> CreateServiceWithContext(IKTDomainContext ctx)
        {
            return new FormTemplateService(_ctx);
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
        [ClaimsAuthorize(Permission = AppRoles.FORMS_MANAGER)]
        public Task<IHttpActionResult> Post([FromBody] FormTemplate newEntity)
        {
            return DoPost(newEntity);
        }

        // PUT api/{entity}
        [HttpPut, Route("{id}")]
        [ClaimsAuthorize(Permission = AppRoles.FORMS_MANAGER)]
        public Task<IHttpActionResult> Put(Guid id, FormTemplate entity)
        {
            return DoPut(id, entity);
        }

        // DELETE api/{entity}/{id}
        [HttpDelete, Route("{id}")]
        [ClaimsAuthorize(Permission = AppRoles.FORMS_MANAGER)]
        public Task<IHttpActionResult> Delete(Guid id)
        {
            return DoDelete(id);
        }

        [HttpDelete]
        [Route("")]
        [ClaimsAuthorize(Permission = AppRoles.FORMS_MANAGER)]
        public Task<IHttpActionResult> Delete([FromBody] Guid[] ids)
        {
            return DoDelete(ids);
        }

    }

}
