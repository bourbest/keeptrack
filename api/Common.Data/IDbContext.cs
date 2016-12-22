using System;
using System.Threading.Tasks;

namespace Common.Data
{
    public interface IDbContext : IDisposable
    {
        Guid InstanceId { get; }
        Task<long> SaveChangesAsync();
    }
}
