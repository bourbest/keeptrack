using System;
using System.Threading.Tasks;

namespace Common.Data
{
    public interface IUnitOfWork : IDisposable
    {
        Task<long> SaveAsync();
    }
}
