using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types
{
    public class EntityCache<TEntity>
    {
        public delegate Task<IEnumerable<TEntity>> RefreshCacheFunction(object ctx);

        public EntityCache(TimeSpan duration, RefreshCacheFunction refreshFunction)
        {
            _lockCache = new AsyncLock();
            _lastRefresh = DateTime.Now.AddHours(-2);
            _entities = null;
            _duration = duration;
            _RefreshCacheFunction = refreshFunction;
        }

        public async Task<IEnumerable<TEntity>> GetValues(object ctx)
        {
            IEnumerable<TEntity> ret;
            bool mustRefresh = false;
            using (await _lockCache.LockAsync().ConfigureAwait(false))
            {
                mustRefresh = _lastRefresh.Add(_duration) < DateTime.Now;

                if (mustRefresh)
                    _lastRefresh = DateTime.Now; // this prevents other requests from performing the refresh

                if (_entities == null)
                {
                    _entities = await _RefreshCacheFunction(ctx).ConfigureAwait(false); // first call ever, other threads need to wait
                    mustRefresh = false;
                }

                ret = _entities;
            }

            // the data will be refreshed while other request can use the old copy. The swap will be made
            // just in time so the service can continue to answer with old data while it's being refreshed
            if (mustRefresh)
            {
                ret = await _RefreshCacheFunction(ctx).ConfigureAwait(false);
                using (await _lockCache.LockAsync().ConfigureAwait(false))
                {
                    _entities = ret;
                }
            }

            return ret;
        }


        private AsyncLock _lockCache;
        private DateTime _lastRefresh;
        private IEnumerable<TEntity> _entities;
        private TimeSpan _duration;
        private RefreshCacheFunction _RefreshCacheFunction;
    }
}
