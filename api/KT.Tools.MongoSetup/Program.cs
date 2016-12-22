using MongoDB.Driver;
using System;
using System.Configuration;
using Common.Types.Log;

namespace KT.Tools.MongoDBSetup
{
    class Program
    {
        static void Main(string[] args)
        {
            string databaseHost = ConfigurationManager.AppSettings["DatabaseHost"];
            string databaseName = ConfigurationManager.AppSettings["DatabaseName"];

            var observers = SetupLogs();
            SetupME setup = new SetupME(observers);

            MongoClient client = new MongoClient(databaseHost);

            observers.LogAction(string.Format("Opening database: {0}", databaseName));
            IMongoDatabase db = client.GetDatabase(databaseName);

            setup.ApplyUpdate(db);

            Console.WriteLine("Appuyer sur une touche pour terminer l'exécution du programme.");
            Console.Read();
        }

        private static IObserver SetupLogs()
        {
            ObserverList logs = new ObserverList();
            ConsoleLogger consoleLog = new ConsoleLogger()
            {
                DisplayInformation = true
            };

            FileLogger fileLogger = new FileLogger("mongo-setup")
            {
                WriteActions = true,
                WriteInformations = true
            };

            logs.Register(consoleLog);
            logs.Register(fileLogger);

            return logs;
        }
    }
}
