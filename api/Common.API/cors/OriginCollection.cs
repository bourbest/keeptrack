using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.API.Cors
{
    public class OriginCollection : ConfigurationElementCollection
    {

        #region - Constructors -

        public OriginCollection()
        {
            //OriginElement origin = (OriginElement)this.CreateNewElement();
            //this.Add(origin);
        }

        #endregion

        protected override ConfigurationElement CreateNewElement()
        {
            return new OriginElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((OriginElement)element).Name;
        }

        public OriginElement this[int index]
        {
            get
            {
                return (OriginElement)BaseGet(index);
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

        new public OriginElement this[string Name]
        {
            get
            {
                return (OriginElement)BaseGet(Name);
            }
        }

        public int IndexOf(OriginElement origin)
        {
            return BaseIndexOf(origin);
        }

        public void Add(OriginElement origin)
        {
            BaseAdd(origin);
        }
        protected override void BaseAdd(ConfigurationElement element)
        {
            BaseAdd(element, false);
        }

        public void Remove(OriginElement origin)
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
