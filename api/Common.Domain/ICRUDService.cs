using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Common.Types;
using Common.Data;

namespace Common.Domain
{
    public interface ICRUDService<TKey, TModel> : IDisposable
        where TModel : IModel<TKey>, new()
    {

        Task<TModel> GetEntityAsync(TKey id);

        Task<List<TModel>> ListEntitiesAsync(QueryParameters query);

        Task<int> CountAsync(QueryParameters query);

        Task AddEntityAsync(TModel newEntity);

        Task DeleteEntityAsync(TKey id);

        Task DeleteManyAsync(IEnumerable<TKey> ids);

        Task UpdateEntityAsync(TModel entity);

        Task ArchiveEntity(TKey entity);

        Task RestoreEntity(TKey entity);
    }
}
