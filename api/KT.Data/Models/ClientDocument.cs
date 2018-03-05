using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;
using Common.Data;

namespace KT.Data.Models
{
    public class ClientDocument : IModel<Guid>
    {
        public ClientDocument()
        {
            Id = Guid.NewGuid();
            Values = new Dictionary<string, object>();
        }

        [BsonId]
        public Guid Id { get; set; }

        public Guid ClientId { get; set; }
        public Guid FormId  { get; set; }
        public Dictionary<string, object> Values { get; set; }

        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
