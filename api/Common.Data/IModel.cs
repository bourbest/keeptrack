
namespace Common.Data
{
    public interface IModel<TKey>
    {
        TKey Id { get; }
    }
}
