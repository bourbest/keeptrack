using System;


namespace Common.Types
{
    public static class DateTimeExtension
    {
        public static DateTime RemoveTicks(this DateTime value)
        {
            long ticks = value.Ticks % 10000000;
            return value.AddTicks(ticks * -1);
        }
    }
}
