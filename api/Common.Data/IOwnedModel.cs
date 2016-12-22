namespace Common.Data
{
    public interface IOwnedModel<TKey, TOwnerId> : IModel<TKey>
    {
        TOwnerId OwnerId { get; set; }
    }
}
