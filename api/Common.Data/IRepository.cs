using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Common.Types;
namespace Common.Data
{
    public interface IRepository<TKey, TModel> where TModel : IModel<TKey>
    {
        Task<int> CountAsync(QueryParameters queryParameters);
        Task<List<TModel>> FindByFiltersAsync(QueryParameters queryParameters);

        Task<TModel> FindByIdAsync(TKey id);
        Task<List<TModel>> FindByIdsAsync(IEnumerable<TKey> ids);
        Task<List<TModel>> FindAll(int? limit = null);
        Task<List<TModel>> FindNextFromId(TKey id, int getCount);

        void Insert(TModel model);
        void InsertRange(IEnumerable<TModel> models);
        void Update(TModel model);
        void Upsert(TModel model);

        void Delete(TKey id);
        void DeleteMany(IEnumerable<TKey> ids);
    }
}
