using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Booking
    {

        public static DataTable BookingsInTable(int WeekID,string PatientID,int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select * from Bookings 
                                            inner join Periods on Periods.ID=Bookings.PeriodID
                                            where Bookings.WeekID={0} and Bookings.PatientID='{1}'
                                            and Periods.StaffID={2}", WeekID, PatientID, StaffID);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        adabter.Fill(dt);
                    }
                }

                return dt;
            }
        }

        public static bool CheckBookingOrNot(int weekID,int StaffID,int Day,int Period,string PatientID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select * from Bookings 
                                            inner join Periods on Periods.ID=Bookings.PeriodID
                                            where Bookings.WeekID={0} and Bookings.PatientID='{1}'
                                            and Periods.StaffID={2} and Periods.Day={3} and Periods.Period={4};", weekID, PatientID, StaffID, Day, Period);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        adabter.Fill(dt);
                    }
                }
            }
            return dt.Rows.Count > 0 ? true : false;
        }

        public static int AddNewBook(int WeekID,int PeriodID,string PatientID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("INSERT INTO Bookings ( WeekID , PeriodID , PatientID ) VALUES ({0},{1},'{2}');", WeekID, PeriodID, PatientID);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            return 1;
        }

        public static int deleteBook(int WeekID,int PeriodID,string PatientID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("delete from Bookings where WeekID={0} and PeriodID={1} and PatientID='{2}';", WeekID, PeriodID, PatientID);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            return 1;
        }

        public static List<Reminder> getAllBookingsOfPatient(string PatinetID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select *,Users.Name as 'StaffName'
                                            from Bookings 
                                            inner join Weeks on Bookings.WeekID=Weeks.ID
                                            inner join Periods on Bookings.PeriodID=Periods.ID
                                            inner join Users on Users.ID=Periods.StaffID
                                            where Bookings.PatientID='{0}'
                                            order by Weeks.StartDay, Periods.Day,Periods.Period", PatinetID);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        adabter.Fill(dt);
                    }
                }
            }

            List<Reminder> AllBookings = new List<Reminder>();

            foreach(DataRow R in dt.Rows)
            {
                string dateExtracted = R["StartDay"].ToString().Split(' ')[0];
                string[] dateSlots = dateExtracted.Split('/');
                int Month = int.Parse(dateSlots[0]);
                int Day = int.Parse(dateSlots[1]);
                int Year = int.Parse(dateSlots[2]);
                DateTime dateTime = new DateTime(Year, Month, Day);
                dateTime = dateTime.AddDays(int.Parse(R["Day"].ToString()) - 1);

                ///////////////convering to string 
                string ssss = dateTime.ToString();
                ////////////////

                bool is_exist = false;

                for (int i=0; i < AllBookings.Count ; i++)
                {
                    string firststring = dateTime.ToString().Split(' ')[0];
                    string secondstring = AllBookings[i].Date.ToString().Split(' ')[0];
                    if (dateTime.ToString().Split(' ')[0].Equals(AllBookings[i].Date.ToString().Split(' ')[0], StringComparison.Ordinal))
                    {
                        is_exist = true;
                        string from, to;
                        getTimes(int.Parse(R["Period"].ToString()), out from, out to);
                        AllBookings[i].AddNewRecord(new Reminder.Record(from, to, R["StaffName"].ToString()));
                    }
                }

                if (is_exist == false)
                {
                    AllBookings.Add(new Reminder(dateTime));
                    string from, to;
                    getTimes(int.Parse(R["Period"].ToString()), out from, out to);
                    AllBookings[AllBookings.Count - 1].AddNewRecord(new Reminder.Record(from, to, R["StaffName"].ToString()));
                }
                
            }

            for(int i=0; i < AllBookings.Count; i++)
            {
                if(AllBookings[i].Date.Date < DateTime.Now.Date)
                {
                    AllBookings.RemoveAt(i);
                    i = -1;
                }
            }

            return AllBookings;
            
        }

        public static void getTimes(int Period,out string from,out string to)
        {
            switch (Period)
            {
                case 1:
                    from = "09:00 AM";
                    to = "10:00 AM";
                    break;
                case 2:
                    from = "10:00 AM";
                    to = "11:00 AM";
                    break;
                case 3:
                    from = "11:00 AM";
                    to = "12:00 AM";
                    break;
                case 4:
                    from = "12:00 PM";
                    to = "01:00 PM";
                    break;
                case 5:
                    from = "01:00 PM";
                    to = "02:00 PM";
                    break;
                case 6:
                    from = "02:00 PM";
                    to = "03:00 PM";
                    break;
                case 7:
                    from = "03:00 PM";
                    to = "04:00 PM";
                    break;
                default:
                    from = null;
                    to = null;
                    break;
            }
        }

        public static Reminder BookingOfPatientToday(string PatientID)
        {
            List<Reminder> AllBookings = getAllBookingsOfPatient(PatientID);

            foreach(Reminder R in AllBookings)
            {
                if(R.Date.ToString().Split(' ')[0].Equals(DateTime.Now.ToString().Split(' ')[0], StringComparison.Ordinal))
                {
                    return R;
                }
            }
            return null;
        }

        public static DataTable GetReservers(int PeriodID,int WeekID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select Patients.*
                                            from Bookings
                                            inner join Patients ON Bookings.PatientID=Patients.ID
                                            where Bookings.PeriodID={0} and Bookings.WeekID={1};", PeriodID, WeekID);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        adabter.Fill(dt);
                    }
                }
            }

            return dt;
        }
    }
}