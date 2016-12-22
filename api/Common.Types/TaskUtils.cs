using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types
{
    public class TaskUtils
    {
        public static void ThrowIfAnyFaulted(IEnumerable<Task> tasks)
        {
            List<AggregateException> exs = tasks.Select(t => t.Exception)
                                                .Where(e => e != null)
                                                .ToList();

            if (exs.Count > 0)
                throw exs[0];
        }
    }
}
