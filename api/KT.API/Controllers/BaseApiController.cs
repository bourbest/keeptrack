using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Common.API;
using Common.Data;
using Common.Domain;

using KT.Domain;
using KT.Data;
using System.Web.Http;
using System.Threading.Tasks;
using Common.Types;
using System.Net.Http;
using System.Net;
using KT.Data.Models;

namespace KT.API.Controllers
{
    [RequireHttps]
    public abstract class BaseApiController<TKey, TModel> : ApiController where TModel : IModel<TKey>, new()
    {
        protected IKTUnitOfWork _uow;
        protected KTDomainContext _ctx;

        public BaseApiController(IKTUnitOfWork uow)
        {
            _uow = uow;
            _ctx = new KTDomainContext(uow, RequestContext.Principal);
        }

        protected ICRUDService<TKey, TModel> CreateService()
        {
            _ctx.CurrentUser = new UserIdentity(RequestContext.Principal);
            return CreateServiceWithContext(_ctx);
        }

        protected abstract ICRUDService<TKey, TModel> CreateServiceWithContext(IKTDomainContext ctx);

        protected string DoOptions()
        {
            return null;
        }

        protected async Task<IHttpActionResult> DoList(QueryParameters query = null)
        {
            List<TModel> list;
            if (query == null)
                query = new QueryParameters();

            using (ICRUDService<TKey, TModel> service = CreateService())
            {
                list = await service.ListEntitiesAsync(query);
            }

            HttpResponseMessage msg = Request.CreateResponse(HttpStatusCode.OK, list);

            return ResponseMessage(msg);
        }


        protected async Task<IHttpActionResult> DoHead(QueryParameters queryParameters)
        {
            int total = 0;
            using (ICRUDService<TKey, TModel> service = CreateService())
            {
                total = await service.CountAsync(queryParameters);
            }

            HttpResponseMessage msg = Request.CreateResponse(HttpStatusCode.OK, total);

            return ResponseMessage(msg);
        }

        protected async Task<IHttpActionResult> DoGet(TKey id)
        {
            using (ICRUDService<TKey, TModel> service = CreateService())
            {
                TModel entity = await service.GetEntityAsync(id);

                if (entity != null)
                {
                    return Ok(entity);
                }
                else
                {
                    return NotFound();
                }
            }

        }

        protected async Task<IHttpActionResult> DoPost(TModel newEntity)
        {
            using (ICRUDService<TKey, TModel> service = CreateService())
            {
                await service.AddEntityAsync(newEntity);
            }

            // insère l'uri de la nouvelle ressource dans le Header
            //NOTE: (2016-02-04) WebApi2 AttributeRouting doesn't use a global routeName
            //string uriStr = Url.Link("DefaultApi", new { id = newEntity.Id.ToString() }); ==> this causes an error since "DefaultApi" is not present in the routeCollection
            //this is a workaround.
            string uriStr = string.Format("{0}/{1}", Url.Request.RequestUri.ToString(), newEntity.Id.ToString());
            return Created(uriStr, newEntity);
        }

        protected async Task<IHttpActionResult> DoPut(TKey id, TModel entity)
        {
            try
            {
                using (ICRUDService<TKey, TModel> service = CreateService())
                {
                    await service.UpdateEntityAsync(entity);
                    return Ok(entity);
                }
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            }
        }

        protected async Task<IHttpActionResult> DoDelete(TKey id)
        {
            try
            {
                using (ICRUDService<TKey, TModel> service = CreateService())
                {
                    await service.DeleteEntityAsync(id);
                    return StatusCode(HttpStatusCode.NoContent);
                }
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            }

        }

        protected async Task<IHttpActionResult> DoDelete(IEnumerable<TKey> ids)
        {
            try
            {
                if (ids != null && ids.Count() > 0)
                {
                    using (ICRUDService<TKey, TModel> service = CreateService())
                    {
                        await service.DeleteManyAsync(ids);
                        return StatusCode(HttpStatusCode.NoContent);
                    }
                }
                else
                {
                    return BadRequest("No ids provided in body");
                }
            }
            catch (EntityNotFoundException)
            {
                return NotFound();
            }
        }
    }
}