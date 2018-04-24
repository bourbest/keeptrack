using MongoDB.Driver;
using KT.Tools.MongoDBSetup;
using Common.Types.Log;
using KT.Data.Models;
using KT.Domain;
using System.Collections.Generic;
using Common.Data.MongoDB;
using System.Threading.Tasks;
using System;

namespace KT.Tools.MongoDBSetup
{
    public class SetupME
    {
        private MongoDBSetupHelper _helper;
        private readonly IObserver _observer;

        public SetupME(IObserver observer)
        {
            _helper = new MongoDBSetupHelper(observer);
            _observer = observer;
        }

        public string[] Changes
        {
            get
            {
                return new string[] 
                {
                    "Maison Éclaircie Database setup"
                };
            }
        }

        public void ApplyUpdate(IMongoDatabase db)
        {
            CreateCollectionClientFiles(db);
            CreateCollectionClientDocument(db);
            CreateCollectionEvolutionNote(db);
            CreateCollectionUser(db);
            CreateListOptions(db);
        }

        private void CreateListOptions(IMongoDatabase db)
        {
            ListOption[] options = new ListOption[]
            {
                new ListOption() { Id = "1", ListId = "Origine", Name = "03 - Québec" },
                new ListOption() { Id = "2", ListId = "Origine", Name = "06 - Lévis" },

                new ListOption() { Id = "INTER", ListId = "OrganismRole", Name = "Intervenante" },
                new ListOption() { Id = "BENEV", ListId = "OrganismRole", Name = "Bénévole" },
                new ListOption() { Id = "ADJ.ADM", ListId = "OrganismRole", Name = "Adjointe administrative" },
                new ListOption() { Id = "DIREC", ListId = "OrganismRole", Name = "Directrice" },

                new ListOption() { Id = AppRoles.CAN_INTERACT_WITH_CLIENTS, ListId = "AppRole", Name = "Créer et modifier un dossier de participant" },
                new ListOption() { Id = AppRoles.FORMS_MANAGER, ListId = "AppRole", Name = "Gérer les formulaires" },
                new ListOption() { Id = AppRoles.STATS_PRODUCER, ListId = "AppRole", Name = "Consulter et produire les statistiques" },
                new ListOption() { Id = AppRoles.USER_MANAGER, ListId = "AppRole", Name = "Administrer les comptes utilisateurs" }
            };

            IMongoCollection<ListOption> collection = db.GetCollection<ListOption>(typeof(ListOption).Name)
                                                               .WithWriteConcern(WriteConcern.WMajority);
            var updateOption = new UpdateOptions() { IsUpsert = true };
            foreach (ListOption option in options)
                collection.ReplaceOne(p => p.Id == option.Id, option, updateOption);
        }

        private void CreateCollectionClientFiles(IMongoDatabase db)
        {
            IMongoCollection<ClientFile> collection = db.GetCollection<ClientFile>(typeof(ClientFile).Name)
                                                               .WithWriteConcern(WriteConcern.WMajority);

            _helper.CreateIndex(collection, p => p.FullName);
        }

        private void CreateCollectionClientDocument(IMongoDatabase db)
        {
            IMongoCollection<ClientDocument> collection = db.GetCollection<ClientDocument>(typeof(ClientDocument).Name);
            _helper.CreateIndex(collection, p => p.ClientId);
            _helper.CreateIndex(collection, p => p.IntervenantId);
        }

        private void CreateCollectionEvolutionNote(IMongoDatabase db)
        {
            IMongoCollection<EvolutionNote> collection = db.GetCollection<EvolutionNote>(typeof(EvolutionNote).Name);
            _helper.CreateIndex(collection, p => p.ClientId);
        }

        private void CreateCollectionUser(IMongoDatabase db)
        {
            IMongoCollection<UserIdentity> collection = db.GetCollection<UserIdentity>(typeof(UserIdentity).Name);
            _helper.CreateIndex(collection, p => p.UserName);
        }
    }
}
