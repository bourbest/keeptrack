using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Log
{
    public class EmptyObserver : IObserver
    {
        public void LogAction(string action)
        {
        }

        public void LogError(Exception ex = null)
        {
        }

        public void LogInformation(string info)
        {
        }

        public void LogProgress(string message)
        {
        }

        public void LogWarning(string info)
        {
        }
    }
}
