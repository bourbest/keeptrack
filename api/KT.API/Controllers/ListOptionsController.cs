using System.Threading.Tasks;
using System.Web.Http;

using KT.Data;
using KT.Data.Models;
using System.Collections.Generic;

namespace KT.API.Controllers
{
    [AllowAnonymous]
    [RoutePrefix("list-options")]
    public class ListOptionController : ApiController
    {
        private readonly IKTUnitOfWork _uow;
        public ListOptionController(IKTUnitOfWork uow) : base()
        {
            _uow = uow;
        }

        [HttpOptions, Route]
        public string Options()
        {
            return null;
        }

        [HttpGet, Route("")]
        public async Task<IHttpActionResult> List()
        {
            List<ListOption> options = await _uow.ListOptions.FindAll().ConfigureAwait(false);
            return Ok(options);
        }
    }

}
