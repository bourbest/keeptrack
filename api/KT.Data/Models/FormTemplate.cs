using System;
using MongoDB.Bson.Serialization.Attributes;
using Common.Data;
using System.Collections.Generic;

namespace KT.Data.Models
{
    public class FormFieldChoice
    {
        public object Value { get; set; }
        public Dictionary<string, string> Labels { get; set; }
    }

    public class FormField
    {
        public string Id { get; set; }
        public string ControlType { get; set; }
        public string ParentId { get; set; }
        public int Order { get; set; }

        [BsonIgnoreIfNull]
        public Dictionary<string, string> Labels { get; set; }

        [BsonIgnoreIfNull]
        public int? ColumnCount { get; set; }

        [BsonIgnoreIfNull]
        public bool? IsRequired { get; set; }

        [BsonIgnoreIfNull]
        public List<FormFieldChoice> Choices { get; set; }

        [BsonIgnoreIfNull]
        public int? MaxLength { get; set; }

        [BsonIgnoreIfNull]
        public bool? UseCurrentDateAsDefaultValue { get; set; }

        [BsonIgnoreIfNull]
        public string MinValue { get; set; }

        [BsonIgnoreIfNull]
        public string MaxValue { get; set; }

        [BsonIgnoreIfNull]
        public int? HeaderLevel { get; set; }
    }

    public class FormTemplate : IModel<Guid>
    {
        public FormTemplate()
        {
            Id = Guid.NewGuid();
            Fields = new List<FormField>();
        }

        [BsonId]
        public Guid Id { get; set; }

        public string Name { get; set; }
        public List<FormField> Fields { get; set; }

        public bool IsArchived { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

    }
}
