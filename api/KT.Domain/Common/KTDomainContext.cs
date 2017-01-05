using System;

using Common.Types;

using KT.Data;
using KT.Data.Models;

namespace KT.Domain
{
    public class KTDomainContext : IKTDomainContext, IDisposable
    {
        DateTime _taskBeginTime = DateTime.Now;

        public DateTime? ForcedCurrentTime { get; set; }

        public KTDomainContext(IKTUnitOfWork uow = null, System.Security.Principal.IPrincipal principal = null)
        {
            Uow = uow != null ? uow : new KTMongoDBUnitOfWork();
            CurrentUser = new UserIdentity(principal);
        }

        public KTDomainContext(UserIdentity user, IKTUnitOfWork uow = null)
        {
            Uow = uow != null ? uow : new KTMongoDBUnitOfWork();
            CurrentUser = user;
        }

        public UserIdentity CurrentUser { get; set; }
        public IKTUnitOfWork Uow { get; set; }

        public DateTime TaskBeginTime
        {
            get
            {
                return _taskBeginTime;
            }
            set
            {
                _taskBeginTime = value.RemoveTicks();
            }
        }

        public DateTime CurrentTime
        {
            get
            {
                if (ForcedCurrentTime.HasValue)
                    return ForcedCurrentTime.Value;
                else
                    return DateTime.Now.RemoveTicks();
            }
        }

        #region IDispose
        bool _disposed = false;
        public void Dispose()
        {
            Dispose(true);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                Uow.Dispose();
            }
            _disposed = true;
        }
        #endregion
    }
}
