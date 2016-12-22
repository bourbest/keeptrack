using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Log
{
    public class ConsoleLogger : IObserver
    {
        private string _lastAction = string.Empty;

        public bool DisplayInformation { get; set; }
        public void LogAction(string action)
        {
            _lastAction = action;
            DisplayInformation = true;
            Write(action);
        }

        public void LogError(Exception ex)
        {
            string message = string.Format("The following exception was thrown. The last action logged was : {0}\n{1}",
                            _lastAction, ex.ToString());
            Write(message);
        }

        public void LogInformation(string info)
        {
            if (DisplayInformation)
                Write(info);
        }

        public void LogProgress(string message)
        {
            Write(message);
        }

        public void LogWarning(string info)
        {
            Write(string.Format("WARNING: {0}", info));
        }

        private void Write(string message)
        {
            Console.WriteLine("{0:yyyy-MM-dd HH:mm:ss} {1}", DateTime.Now, message);
        }
    }
}
