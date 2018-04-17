using System;
using MongoDB.Bson.Serialization.Attributes;
using Common.Data;
using System.Collections.Generic;
using Newtonsoft.Json;
using Common.Types;

namespace KT.Data.Models
{
    public class ClientFile : IModel<Guid>
    {
        public ClientFile()
        {
            Id = Guid.NewGuid();
            MainPhoneNumber = new PhoneNumber();
            AlternatePhoneNumber = new PhoneNumber();
            this.Address = new Address();
        }

        [BsonId]
        public Guid Id { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Notes { get; set; }
        public string Gender { get; set; }

        public string Email { get; set; }
        public bool AcceptPublipostage { get; set;}

        public PhoneNumber MainPhoneNumber { get; set; }
        public PhoneNumber AlternatePhoneNumber { get; set; }
        public Address Address { get; set; }
        public string OriginId { get; set; }

        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        [JsonIgnore]
        public string FullName
        {
            get
            {
                string firstName = this.FirstName.RemoveDiacritics().ToLower();
                string lastName = this.LastName.RemoveDiacritics().ToLower();
                return firstName + " " + lastName;
            }
            private set { }
        }

    }
}
