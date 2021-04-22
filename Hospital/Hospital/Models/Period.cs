using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Period
    {
        public static int SaveNewPeriod(int day ,int period ,int staff_id)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("insert into Periods (Day,Period,StaffID) values ({0},{1},{2})",day,period,staff_id);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        //adabter.Fill(dt);
                    }
                }
            }
            return 1;
        }

        public static DataTable GetStaffTable(int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("select * from  Periods where StaffID={0}", StaffID);
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

        public static int DeletePeriod(int StaffID,int Day,int Period)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("delete from Periods where StaffID={0} and Day={1} and Period={2}", StaffID,Day,Period);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        //adabter.Fill(dt);
                    }
                }
            }
            return 1;
        }

        public static int getPeriodID(int Day,int Period,int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("select * from  Periods where StaffID={0} and Day={1} and Period={2};", StaffID, Day, Period);
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

            return int.Parse(dt.Rows[0]["ID"].ToString());
        }
    }
}