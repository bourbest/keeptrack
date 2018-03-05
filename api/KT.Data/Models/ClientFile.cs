using System;
using MongoDB.Bson.Serialization.Attributes;
using Common.Data;
using System.Collections.Generic;

namespace KT.Data.Models
{
    public class ClientFile : IModel<Guid>
    {
        public ClientFile()
        {
            Id = Guid.NewGuid();
            PhoneNumbers = new List<PhoneNumber>();
            this.Address = new Address();
        }

        [BsonId]
        public Guid Id { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string OriginId { get; set; }
        public string Notes { get; set; }
        public string Gender { get; set; }
        public List<PhoneNumber> PhoneNumbers {get; set;}
        public Address Address { get; set; }

        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
