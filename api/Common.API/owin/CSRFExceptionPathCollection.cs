using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.API.OWin
{
    public class CSRFExceptionPathCollection : ConfigurationElementCollection
    {

        #region - Constructors -

        public CSRFExceptionPathCollection()
        {
        }

        #endregion

        protected override ConfigurationElement CreateNewElement()
        {
            return new CSRFExceptionPathElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((CSRFExceptionPathElement)element).Name;
        }

        public CSRFExceptionPathElement this[int index]
        {
            get
            {
                return (CSRFExceptionPathElement)BaseGet(index);
            }
            set
            {
                if (BaseGet(index) != null)
                {
                    BaseRemoveAt(index);
                }
                BaseAdd(index, value);
            }
        }

        new public CSRFExceptionPathElement this[string Name]
        {
            get
            {
                return (CSRFExceptionPathElement)BaseGet(Name);
            }
        }

        public int IndexOf(CSRFExceptionPathElement origin)
        {
            return BaseIndexOf(origin);
        }

        public void Add(CSRFExceptionPathElement origin)
        {
            BaseAdd(origin);
        }
        protected override void BaseAdd(ConfigurationElement element)
        {
            BaseAdd(element, false);
        }

        public void Remove(CSRFExceptionPathElement origin)
        {
            if (BaseIndexOf(origin) >= 0)
                BaseRemove(origin.Name);
        }

        public void RemoveAt(int index)
        {
            BaseRemoveAt(index);
        }

        public void Remove(string name)
        {
            BaseRemove(name);
        }

        public void Clear()
        {
            BaseClear();
        }
    }
}
