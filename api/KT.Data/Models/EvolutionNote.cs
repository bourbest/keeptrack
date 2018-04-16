using Common.Data;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KT.Data.Models
{
    public class EvolutionNote : IModel<Guid>
    {
        public EvolutionNote()
        {
            Id = Guid.NewGuid();
        }

        [BsonId]
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string Note { get; set; }

        public Guid OwnerId { get; set; } // allows edit / delete
        public string AuthorName { get; set; }
        public string AuthorRole { get; set; } // at time of creation, this can change in time

        public int Minutes { get; set; } // time in minutes taken with participant
        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
