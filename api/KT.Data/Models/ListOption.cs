using System;
using Common.Data;
using MongoDB.Bson.Serialization.Attributes;

namespace KT.Data.Models
{
    public class ListOption : IModel<string>
    {
        public ListOption()
        {
        }

        [BsonId]
        public string Id { get; set; }

        public string Name { get; set; }

        public string ListId { get; set; }

        public DateTime CreatedOn { get; set; }
        
        public DateTime ModifiedOn { get; set; }

        public bool IsArchived { get; set; }
    }
}
