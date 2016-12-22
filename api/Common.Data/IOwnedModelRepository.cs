using System.Collections.Generic;
using System.Threading.Tasks;

namespace Common.Data
{
    public interface IOwnedModelRepository<TKey, TModel, TOwnerId> : IRepository<TKey, TModel> where TModel : IOwnedModel<TKey, TOwnerId>
    {
        Task<TModel> FindByIdForOwnerAsync(TKey id, TOwnerId ownerId);
        Task<List<TModel>> FindByIdsForOwnerAsync(IEnumerable<TKey> ids, TOwnerId ownerId);

        Task<List<TModel>> FindAllForOwnerAsync(TOwnerId ownerId);

        void UpdateForOwner(TModel model, TOwnerId ownerId);
        void UpsertForOwner(TModel model, TOwnerId ownerId);

        void DeleteForOwner(TKey id, TOwnerId ownerId);
        void DeleteManyForOwner(IEnumerable<TKey> ids, TOwnerId ownerId);
    }
}
