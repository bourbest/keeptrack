using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.API
{
    public interface IWebSocket
    {
        string OnOpen();
        string OnError(string message = null, Exception ex = null);
        string OnMessage(string message);
        void OnClose();
    }
}
