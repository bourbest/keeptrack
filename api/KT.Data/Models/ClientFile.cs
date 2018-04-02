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

        // TODO notes évolutives
        // savoir le nom de la personne, son titre la date heure / rédaction
        // temps que ca a duré (obligatoire), va sortir dans le rapport

        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
