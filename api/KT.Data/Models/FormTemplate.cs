using System;
using MongoDB.Bson.Serialization.Attributes;
using Common.Data;
using System.Collections.Generic;

namespace KT.Data.Models
{
    public class FormFieldChoice
    {
        public object Value { get; set; }
        public string Label { get; set; }
        public int Order { get; set; }
    }

    public class FormField
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public bool IsRequired { get; set; }
        public string Label { get; set; }
        public string ClassName { get; set; }
        public bool AllowMultipleChoices { get; set; }
        public bool IsMultiline { get; set; }
        public List<FormFieldChoice> Choices { get; set; }
        public int Order { get; set; }
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
        public DateTime CreatedOn  { get; set; }
        public DateTime ModifiedOn { get; set; }
        public List<FormField> Fields { get; set; }
    }
}
