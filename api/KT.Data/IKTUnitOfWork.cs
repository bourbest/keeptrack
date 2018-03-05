using KT.Data.Repositories;

namespace KT.Data
{
    public interface IKTUnitOfWork : Common.Data.IUnitOfWork
    {
        UserIdentityRepository UserIdentities { get; }

        ClientFileRepository ClientFiles { get; }
        ClientDocumentRepository ClientDocuments { get; }
        FormTemplateRepository FormTemplates { get; }

        IKTUnitOfWork FromReplicaSet { get; }
        IKTUnitOfWork UnsafeFastWrites { get; }
    }
}
