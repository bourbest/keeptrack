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
            ClientAddress = new Address();
        }

        [BsonId]
        public Guid Id { get; set; }

        public Guid IntervenantId { get; set; }

        // Client information. We make a copy because it can change in time and stats
        // need to have information for that time
        public string OriginId { get; set; }
        public Address ClientAddress { get; set; }

        public Guid ClientId { get; set; }
        public Guid FormId  { get; set; }
        public int Status { get; set; }
        public Dictionary<string, object> Values { get; set; }

        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
