using System;

using Common.Domain;

using KT.Data.Models;
using KT.Data.Repositories;


namespace KT.Domain
{
    public class FormTemplateService : ServiceBase<Guid, FormTemplateRepository, FormTemplate>
    {

        public FormTemplateService(IKTDomainContext ctx) : 
            base(ctx.Uow, ctx.Uow.FormTemplates)
        {
        }

    }
}
