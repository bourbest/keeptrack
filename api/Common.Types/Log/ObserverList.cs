using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Log
{
    public class ObserverList : IObserver
    {
        private List<IObserver> _observers;
        public ObserverList()
        {
            _observers = new List<IObserver>();
        }

        public void Register(IObserver observer)
        {
            _observers.Add(observer);
        }

        public void Unregister(IObserver observer)
        {
            _observers.Remove(observer);
        }
        public void LogAction(string action)
        {
            foreach (IObserver observer in _observers)
                observer.LogAction(action);
        }

        public void LogError(Exception ex)
        {
            foreach (IObserver observer in _observers)
                observer.LogError(ex);
        }

        public void LogInformation(string info)
        {
            foreach (IObserver observer in _observers)
                observer.LogInformation(info);

        }

        public void LogProgress(string message)
        {
            foreach (IObserver observer in _observers)
                observer.LogProgress(message);

        }

        public void LogWarning(string info)
        {
            foreach (IObserver observer in _observers)
                observer.LogWarning(info);

        }
    }
}
