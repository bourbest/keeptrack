using MongoDB.Driver;
using KT.Tools.MongoDBSetup;
using Common.Types.Log;

namespace KT.Tools.MongoDBSetup
{
    public class SetupME
    {
        private MongoDBSetupHelper _helper;


        public SetupME(IObserver observer)
        {
            _helper = new MongoDBSetupHelper(observer);
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
        }
    }
}
