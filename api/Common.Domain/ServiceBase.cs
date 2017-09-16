using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

using Common.Data;
using Common.Types;

// Cette classe de base implémente les fonctions de base LCRUD. 

namespace Common.Domain
{
    public abstract class ServiceBase<TKey, TRepository, TModel> : ICRUDService<TKey, TModel>
        where TModel : IModel<TKey>, new()
        where TRepository : IRepository<TKey, TModel>
    {      
        #region constructor

        protected TRepository _mainRepository;
        private readonly IServiceContext _ctx;

        private ServiceBase()
        {
        }

        public ServiceBase(IUnitOfWork uow, TRepository mainRepository, IServiceContext ctx)
        {
            UnitOfWork = uow;
            _mainRepository = mainRepository;
            _ctx = ctx;
        }

        #endregion

        public IUnitOfWork UnitOfWork { get; protected set; }

        protected virtual void RemoveRestrictedData(TModel model) { }

        #region ICRUDService

        public virtual async Task<TModel> GetEntityAsync(TKey id)
        {
            TModel model = await _mainRepository.FindByIdAsync(id).ConfigureAwait(false);
            if (model != null)
                RemoveRestrictedData(model);
            return model;
        }

        public virtual async Task<List<TModel>> ListEntitiesAsync(QueryParameters query)
        {
            if (query.KeyValueFilters.Keys.Contains("isarchived") == false)
                query.KeyValueFilters.Add("isarchived", "false");

            List<TModel> models = await _mainRepository.FindByFiltersAsync(query).ConfigureAwait(false);
            models.ForEach(m => RemoveRestrictedData(m));
            return models;
        }

        public virtual async Task<List<TModel>> GetAll()
        {
            List<TModel> models = await _mainRepository.FindAll().ConfigureAwait(false);
            models.ForEach(m => RemoveRestrictedData(m));
            return models;
        }

        public virtual Task<int> CountAsync(QueryParameters query)
        {
          return _mainRepository.CountAsync(query);
        }

        public virtual Task AddEntityAsync(TModel newEntity)
        {
            IEnumerable<string> errors = ValidateEntity(newEntity, true);
            if (errors != null)
                throw new EntityIsInvalidException(typeof(TModel).Name, newEntity.Id, errors);

            newEntity.CreatedOn = _ctx.TaskBeginTime;
            newEntity.ModifiedOn = _ctx.TaskBeginTime;
            _mainRepository.Insert(newEntity);
            return UnitOfWork.SaveAsync(); 
        }

        public virtual IEnumerable<string> ValidateEntity(TModel newEntity, bool isNew)
        {
            return null;
        }

        public async virtual Task DeleteEntityAsync(TKey id)
        {
          _mainRepository.Delete(id);
          long count = await UnitOfWork.SaveAsync().ConfigureAwait(false);

          if (count == 0)
            throw new EntityNotFoundException(typeof(TModel).Name, id);
        }

        public async virtual Task DeleteManyAsync(IEnumerable<TKey> ids)
        {
            _mainRepository.DeleteMany(ids);
            long count = await UnitOfWork.SaveAsync().ConfigureAwait(false);

            if (count < (long) ids.Count())
                throw new BaseDomainException(typeof(TModel).Name, $"Not all entities deleted");
        }


        public async virtual Task UpdateEntityAsync(TModel entity)
        {
            IEnumerable<string> errors = ValidateEntity(entity, false);
            if (errors != null)
                throw new EntityIsInvalidException(typeof(TModel).Name, entity.Id, errors);
            entity.ModifiedOn = _ctx.TaskBeginTime;
            _mainRepository.Update(entity);
            long count = await UnitOfWork.SaveAsync().ConfigureAwait(false);

            if (count == 0)
              throw new EntityNotFoundException(typeof(TModel).Name, entity.Id);
        }

        public async virtual Task ArchiveEntity(TKey id)
        {
            TModel entity = await _mainRepository.FindByIdAsync(id).ConfigureAwait(false);

            if (entity == null)
                throw new EntityNotFoundException(typeof(TModel).Name, id);

            entity.ModifiedOn = _ctx.TaskBeginTime;
            entity.IsArchived = true;
            _mainRepository.Update(entity);
            await UnitOfWork.SaveAsync().ConfigureAwait(false);
        }

        public async virtual Task RestoreEntity(TKey id)
        {
            TModel entity = await _mainRepository.FindByIdAsync(id).ConfigureAwait(false);

            if (entity == null)
                throw new EntityNotFoundException(typeof(TModel).Name, id);

            entity.ModifiedOn = _ctx.TaskBeginTime;
            entity.IsArchived = true;
            _mainRepository.Update(entity);
            await UnitOfWork.SaveAsync().ConfigureAwait(false);
        }

        #endregion

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
