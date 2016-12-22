using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Common.Types;

namespace Common.API
{
    public class LimitQueryParameters : ActionFilterAttribute
    {
        public string AllowedParameters { get; set; }

        private string[] ParametersAllowed
        {
            get { return AllowedParameters.ToLower().Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries); }
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (AllowedParameters == null)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.BadRequest, "Controller not properly configured : Empty Parameters");
                return;
            }

            if (actionContext.ActionArguments.Any(v => v.Value != null))
            {
                Dictionary<string, object> param = actionContext.ActionArguments;
                if (param.ContainsKey("queryParameters"))
                {
                    var obj = param["queryParameters"];

                    if (obj.GetType() != typeof(QueryParameters))
                        return;

                    foreach (var item in (obj as QueryParameters).KeyValueFilters)
                    {
                        if (!ParametersAllowed.Contains(item.Key.ToLower()))
                        {
                            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.BadRequest, $"Query parameters not allowed : {item.Key}");
                            return;
                        }
                    }
                }
            }
        }
    }
}
