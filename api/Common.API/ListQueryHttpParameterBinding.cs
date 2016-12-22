using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Threading;
using System.Threading.Tasks;

using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Metadata;

using Common.Data;
using Common.Types;

namespace Common.API
{
    class ListQueryHttpParameterBinding : HttpParameterBinding
    {
        public ListQueryHttpParameterBinding(HttpParameterDescriptor parameter)
            : base(parameter)
        {
        }

        public override Task ExecuteBindingAsync(ModelMetadataProvider metadataProvider,
            HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            QueryParameters queryParams = QueryParametersBuilder.BuildFromHttpRequest(actionContext.Request);
            actionContext.ActionArguments[Descriptor.ParameterName] = queryParams;

            var tsc = new TaskCompletionSource<object>();
            tsc.SetResult(null);
            return tsc.Task;
        }
    }


    public class ListQueryFromRequestAttribute : ParameterBindingAttribute
    {
        public override HttpParameterBinding GetBinding(HttpParameterDescriptor parameter)
        {
            if (parameter.ParameterType == typeof(QueryParameters))
            {
                return new ListQueryHttpParameterBinding(parameter);
            }
            return parameter.BindAsError("Wrong parameter type");
        }
    }
}
