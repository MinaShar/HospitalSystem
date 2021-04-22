using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Reminder
    {
        public DateTime Date { get; set; }
        public List<Record> Records { get; set; }

        public class Record
        {
            public string from { get; set; }
            public string to { get; set; }
            public string staff { get; set; }

            public Record(string from,string to,string staff)
            {
                this.from = from;
                this.to = to;
                this.staff = staff;
            }
        }

        public Reminder(DateTime date)
        {
            this.Date = date;
            this.Records = new List<Record>();
        }

        public void AddNewRecord(Record R)
        {
            Records.Add(R);
        }

    }
}