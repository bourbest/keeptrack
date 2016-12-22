using System;
using MongoDB.Bson.Serialization.Attributes;
using Common.Data;

namespace KT.Data.Models
{
    public class ClientFile : IModel<Guid>
    {
        public ClientFile()
        {
            Id = Guid.NewGuid();
        }

        [BsonId]
        public Guid Id { get; set; }

        public string FirstName { get; set; }
        public string LastName  { get; set; }

    }
}
