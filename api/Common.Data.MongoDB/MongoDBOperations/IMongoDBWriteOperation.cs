using System.Threading.Tasks;

namespace Common.Data.MongoDB.MongoOperations
{
    public interface IMongoDBWriteOperation
    {
        Task Execute();
        long GetAffectedCount();
    }
}
