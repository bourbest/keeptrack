using MongoDB.Driver;
using KT.Tools.MongoDBSetup;
using Common.Types.Log;
using KT.Data.Models;
using System.Collections.Generic;
using Common.Data.MongoDB;
using System.Threading.Tasks;

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
