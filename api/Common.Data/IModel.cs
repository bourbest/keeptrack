
using System;

namespace Common.Data
{
    public interface IModel<TKey>
    {
        TKey Id { get; }
        DateTime CreatedOn { get; set; }
        DateTime ModifiedOn { get; set; }
    }
}
