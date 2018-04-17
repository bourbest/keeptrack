using System;
using KT.Data.Models;
using Common.Data.MongoDB;
using MongoDB.Driver;
using System.Collections.Generic;
using Common.Types;
using System.Threading.Tasks;

namespace KT.Data.Repositories
{
    public class ClientFileRepository : MongoDBRepository<Guid, ClientFile>
    {
        public ClientFileRepository(MongoDBContext context) : base(context, context.Collection<ClientFile>())
        {
        }

        /*
        public Task<List<ClientFile>> GetByNameStartsWith(string startsWith, int limit)
        {
            string filterValue = startsWith.RemoveDiacritics().ToLower() + ".*";
            var filter = _builder.Regex(p => p.FullName, filterValue);
            return _collection.Find(filter)
                .SortBy(p => p.FullName)
                .Limit(limit)
                .ToListAsync();
        }
        */

        protected override IFindFluent<ClientFile, ClientFile> ApplyOrderBy(IFindFluent<ClientFile, ClientFile> query, string sortExpression, bool reverse)
        {
            sortExpression = sortExpression.ToLower();
            if (sortExpression == "fullname")
            {
                if (reverse)
                    return query.SortByDescending(p => p.FullName);
                else
                    return query.SortBy(p => p.FullName);
            }
            return query;
        }

        protected override FilterDefinition<ClientFile> GetFilter(string filterName, string filterValue)
        {
            if (filterName.ToLower() == "fullname")
            {
                filterValue = "^" + filterValue.RemoveDiacritics().ToLower() + ".*";
                return _builder.Regex(p => p.FullName, filterValue);
            }
            else 
                return base.GetFilter(filterName, filterValue);
        }
    }
}
