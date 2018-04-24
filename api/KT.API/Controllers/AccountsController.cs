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
    [RoutePrefix("accounts")]
    public class AccountsController : BaseApiController<string, UserIdentity>
    {
        public AccountsController(IKTUnitOfWork uow) : base(uow) { }

        protected override ICRUDService<string, UserIdentity> CreateServiceWithContext(IKTDomainContext ctx)
        {
            return new UserIdentityService(_ctx);
        }

        [AllowAnonymous]
        [HttpOptions, Route]
        public string Options()
        {
            return base.DoOptions();
        }

        [HttpGet, Route("")]
        [ClaimsAuthorize(Permission = AppRoles.USER_MANAGER)]
        public Task<IHttpActionResult> List([ListQueryFromRequest] QueryParameters query)
        {
            return base.DoList(query);
        }

        [HttpGet, Route("{id}")]
        public Task<IHttpActionResult> Get(string id)
        {
            return base.DoGet(id);
        }

        // POST api/{entity}
        [HttpPost, Route]
        [ClaimsAuthorize(Permission = AppRoles.USER_MANAGER)]
        public Task<IHttpActionResult> Post([FromBody] UserIdentity newEntity)
        {
            return DoPost(newEntity);
        }

        // PUT api/{entity}
        [HttpPut, Route("{id}")]
        [ClaimsAuthorize(Permission = AppRoles.USER_MANAGER)]
        public Task<IHttpActionResult> Put(string id, UserIdentity entity)
        {
            return DoPut(id, entity);
        }

        // DELETE api/{entity}/{id}
        [HttpDelete, Route("{id}")]
        [ClaimsAuthorize(Permission = AppRoles.USER_MANAGER)]
        public Task<IHttpActionResult> Delete(string id)
        {
            return DoDelete(id);
        }

        [HttpDelete]
        [Route("")]

        public Task<IHttpActionResult> Delete([FromBody] string[] ids)
        {
            return DoDelete(ids);
        }

    }

}
