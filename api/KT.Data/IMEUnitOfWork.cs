using KT.Data.Repositories;

namespace KT.Data
{
    public interface IMEUnitOfWork : Common.Data.IUnitOfWork
    {
        UserIdentityRepository UserIdentities { get; }

        ClientFileRepository ClientFiles { get; }


        IMEUnitOfWork FromReplicaSet { get; }
        IMEUnitOfWork UnsafeFastWrites { get; }
    }
}
