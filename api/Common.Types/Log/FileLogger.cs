using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types.Log
{
    public class FileLogger : IDisposable, IObserver
    {
        private StreamWriter _writer = null;
        
        private int _currentFileIndex;
        private DateTime _fileCreateDate;
        private long _currentFileAppoxSize;
        private string _currentFileName;
        private bool _currentFileContainsError;

        private string _lastAction = string.Empty;

        public long MaxSize { get; set; }
        public bool WriteActions { get; set; }
        public bool WriteInformations { get; set; }


        public FileLogger(string fileName)
        {
            LogFileName = fileName;
            MaxSize = 4 * 1024 * 1024; // 4MB
            _currentFileIndex = GetFileIndex();
            _currentFileContainsError = false;
            CreateWriter(DateTime.Now);
        }

        public string LogFileName { get; private set;  }

        private int GetFileIndex()
        {
            string filter = string.Format("{0}_{1:yyyy-MM-dd}*.log", LogFileName, DateTime.Now);
            string[] txtFiles = Directory.GetFiles(Directory.GetCurrentDirectory(), filter);

            return txtFiles.Count() + 1;
        }

        protected void Write(string message)
        {
            DateTime logTime = DateTime.Now;
            string logEntry = string.Format("{0:hh:mm:ss} {1}", logTime, message);

            lock (_writer)
            {
                if (logTime.Date != _fileCreateDate.Date)
                {
                    _currentFileIndex = 0;
                    CreateWriter(logTime);
                }
                else if (_currentFileAppoxSize + logEntry.Length > MaxSize)
                {
                    _currentFileIndex++;
                    CreateWriter(logTime);
                }

                _writer.WriteLine(logEntry);
                _writer.Flush();
                _currentFileAppoxSize += logEntry.Length + 2;
            }
        }

        private void CreateWriter(DateTime date)
        {
            if (_writer != null)
            {
                _writer.Close();
                _writer.Dispose();

                if (_currentFileContainsError)
                    RenameForError();
            }

            _currentFileName = string.Format("{0}_{1:yyyy-MM-dd}-{2}.log", LogFileName, date, _currentFileIndex);
            _fileCreateDate = date;
            _writer =  new StreamWriter(_currentFileName, true, Encoding.Default);
            _writer.AutoFlush = true;
            _currentFileAppoxSize = 0;
            _currentFileContainsError = false;
        }

        public virtual void Dispose()
        {
            if (_writer != null)
            {
                _writer.Close();
                _writer.Dispose();
                _writer = null;
            }
        }

        private void RenameForError()
        {
            File.Move(_currentFileName, _currentFileName.Replace(".log", "_error.log"));
        }

        public virtual void LogAction(string action)
        {
            _lastAction = action;
            if (WriteActions)
                Write(action);
        }

        public virtual void LogProgress(string message)
        {
            Write(message);
        }

        public virtual void LogError(Exception ex)
        {
            _currentFileContainsError = true;
            string message = string.Format("The following exception was thrown. The last action logged was : {0}\n{1}",
                _lastAction, ex.ToString());
            Write(message);
        }

        public virtual void LogInformation(string info)
        {
            if (WriteInformations)
                Write(info);
        }

        public virtual void LogWarning(string info)
        {
            Write(string.Format("WARNING: {0}", info));
        }
    }
}
