using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Common.Domain;
using Common.Data;
using Common.Types;

namespace KT.Domain
{
    public class BaseOwnedEntityService<TKey, TRepository, TModel> : ICRUDService<TKey, TModel>
            where TModel : IOwnedModel<TKey, string>, new()
            where TRepository : IOwnedModelRepository<TKey, TModel, string>
    {
        protected IKTDomainContext _context;
        protected TRepository _mainRepository;

        public BaseOwnedEntityService(IKTDomainContext ctx, TRepository mainRepository)
        {
            _context = ctx;
            _mainRepository = mainRepository;
            UnitOfWork = ctx.Uow;
        }

        public IUnitOfWork UnitOfWork { get; protected set; }

        #region ICRUDService

        public virtual async Task<TModel> GetEntityAsync(TKey id)
        {
            TModel model = await _mainRepository.FindByIdForOwnerAsync(id, _context.CurrentUser.Id).ConfigureAwait(false);
            if (model != null)
                RemoveRestrictedData(model);
            return model;
        }

        public virtual async Task<List<TModel>> ListEntitiesAsync(QueryParameters query)
        {
            if (query.KeyValueFilters == null)
                query.KeyValueFilters = new Dictionary<string, string>();

            query.KeyValueFilters["ownerid"] = _context.CurrentUser.Id;

            List<TModel> models = await _mainRepository.FindByFiltersAsync(query).ConfigureAwait(false);
            models.ForEach(m => RemoveRestrictedData(m));
            return models;
        }

        public virtual async Task<List<TModel>> ListEntitiesAsyncWithForcedOwnerId(QueryParameters query)
        {
            if (!query.KeyValueFilters.ContainsKey("ownerid"))
                throw new Exception("ListEntitiesAsyncWithForcedOwnerId must be called with a forced ownerid");

            List<TModel> models = await _mainRepository.FindByFiltersAsync(query).ConfigureAwait(false);
            models.ForEach(m => RemoveRestrictedData(m));
            return models;
        }

        public virtual async Task<List<TModel>> GetAll()
        {
            List<TModel> models = await _mainRepository.FindAllForOwnerAsync(_context.CurrentUser.Id).ConfigureAwait(false);
            models.ForEach(m => RemoveRestrictedData(m));
            return models;
        }

        public virtual Task<int> CountAsync(QueryParameters query)
        {
            query.KeyValueFilters["ownerid"] = _context.CurrentUser.Id;
            return _mainRepository.CountAsync(query);
        }

        public virtual Task<int> CountAsyncWithForcedOwnerId(QueryParameters query)
        {
            if (!query.KeyValueFilters.ContainsKey("ownerid"))
                throw new Exception("CountAsyncWithForcedOwnerId must be called with a forced ownerid");

            return _mainRepository.CountAsync(query);
        }

        public virtual Task AddEntityAsync(TModel newEntity)
        {
            newEntity.OwnerId = _context.CurrentUser.Id;
            IEnumerable<string> errors = ValidateEntity(newEntity, true);

            if (errors != null)
                throw new EntityIsInvalidException(typeof(TModel).Name, newEntity.Id, errors);

            _mainRepository.Insert(newEntity);
            return UnitOfWork.SaveAsync();
        }

        public virtual IEnumerable<string> ValidateEntity(TModel newEntity, bool isNew)
        {
            return null;
        }

        public async virtual Task DeleteEntityAsync(TKey id)
        {
            _mainRepository.DeleteForOwner(id, _context.CurrentUser.Id);
            long count = await UnitOfWork.SaveAsync().ConfigureAwait(false);

            if (count == 0)
                throw new EntityNotFoundException(typeof(TModel).Name, id);
        }

        public async virtual Task DeleteManyAsync(IEnumerable<TKey> ids)
        {
            _mainRepository.DeleteManyForOwner(ids, _context.CurrentUser.Id);
            long count = await UnitOfWork.SaveAsync().ConfigureAwait(false);

            if (count < ids.Count())
                throw new BaseDomainException(typeof(TModel).Name, "Not all entities deleted");
        }

        public async virtual Task UpdateEntityAsync(TModel entity)
        {
            IEnumerable<string> errors = ValidateEntity(entity, false);
            if (errors != null)
                throw new EntityIsInvalidException(typeof(TModel).Name, entity.Id, errors);

            _mainRepository.UpdateForOwner(entity, _context.CurrentUser.Id);
            long count = await UnitOfWork.SaveAsync().ConfigureAwait(false);

            if (count == 0)
                throw new EntityNotFoundException(typeof(TModel).Name, entity.Id);
        }

        public async virtual Task ArchiveEntity(TKey id)
        {
            TModel entity = await _mainRepository.FindByIdAsync(id).ConfigureAwait(false);

            if (entity == null)
                throw new EntityNotFoundException(typeof(TModel).Name, id);

            entity.ModifiedOn = DateTime.Now.RemoveTicks();
            entity.IsArchived = true;
            _mainRepository.Update(entity);
            await UnitOfWork.SaveAsync().ConfigureAwait(false);
        }

        public async virtual Task RestoreEntity(TKey id)
        {
            TModel entity = await _mainRepository.FindByIdAsync(id).ConfigureAwait(false);

            if (entity == null)
                throw new EntityNotFoundException(typeof(TModel).Name, id);

            entity.ModifiedOn = DateTime.Now.RemoveTicks();
            entity.IsArchived = true;
            _mainRepository.Update(entity);
            await UnitOfWork.SaveAsync().ConfigureAwait(false);
        }

        protected string CurrentUserId
        {
            get
            {
                return _context.CurrentUser.Id;
            }
        }


        #endregion

        protected virtual void RemoveRestrictedData(TModel model) { }


        #region IDisposable Members
        private bool _isDisposed = false;
        public void Dispose()
        {
            if (!_isDisposed)
            {
                _isDisposed = true;
            }
        }
        #endregion
    }

}
