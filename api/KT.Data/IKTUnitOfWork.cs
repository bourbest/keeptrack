using KT.Data.Repositories;

namespace KT.Data
{
    public interface IKTUnitOfWork : Common.Data.IUnitOfWork
    {
        UserIdentityRepository UserIdentities { get; }

        ClientFileRepository ClientFiles { get; }


        IKTUnitOfWork FromReplicaSet { get; }
        IKTUnitOfWork UnsafeFastWrites { get; }
    }
}
