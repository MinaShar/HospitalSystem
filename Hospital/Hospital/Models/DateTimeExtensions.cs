using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public static class DateTimeExtensions
    {
        public static List<Object> Calculate4ComingWeeks(this DateTime dt)
        {
            List<Object> requiredWeeks = new List<object>();
            int diff = (7 + (dt.DayOfWeek - DayOfWeek.Saturday)) % 7;
            DateTime start = dt.AddDays(-1 * diff).Date;

            requiredWeeks.Add(new { start = start, end = start.AddDays(6) });
            requiredWeeks.Add(new { start = start.AddDays(7), end = start.AddDays(13) });
            requiredWeeks.Add(new { start = start.AddDays(14), end = start.AddDays(20) });
            requiredWeeks.Add(new { start = start.AddDays(21), end = start.AddDays(27) });
            return requiredWeeks;
        }

    }
}