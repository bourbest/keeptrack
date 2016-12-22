using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Log
{
    public interface IObserver
    {
        void LogAction(string action);   // called before performing an action
        void LogProgress(string message); // called after a chunk of work is completed
        void LogError(Exception ex);
        void LogInformation(string info);  // called whenever, use for tracing with verbose option
        void LogWarning(string info);  // called when suspicious but not error
    }
}
