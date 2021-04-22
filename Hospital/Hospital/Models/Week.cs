using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Week
    {

        public static List<Object> checkIfExistAndAddTheNew(List<Object> dates)
        {
            List<Object> requiredDates = new List<Object>();
            DataTable dt;
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                conn.Open();

                for (int i = 0; i < dates.Count; i++)
                {
                    dynamic obj = dates[i];
                    dt = new DataTable();
                    string form = string.Format("SELECT * FROM Weeks WHERE StartDay='{0}';", obj.start);
                    using (SqlCommand cmd = new SqlCommand(form))
                    {
                        cmd.Connection = conn;
                        using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                        {
                            cmd.ExecuteNonQuery();
                            adabter.Fill(dt);
                        }
                    }

                    if(dt.Rows.Count == 0)
                    {
                        form = string.Format("insert into Weeks (StartDay) values ('{0}');", obj.start);
                        using (SqlCommand cmd = new SqlCommand(form))
                        {
                            cmd.Connection = conn;
                            using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                            {
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    form = string.Format("SELECT * FROM Weeks WHERE StartDay='{0}';", obj.start);
                    dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(form))
                    {
                        cmd.Connection = conn;
                        using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                        {
                            cmd.ExecuteNonQuery();
                            adabter.Fill(dt);
                        }
                    }

                    requiredDates.Add(new
                    {
                        start = obj.start,
                        end = obj.end,
                        id = dt.Rows[0]["ID"]
                    });

                }
            }

            return requiredDates;
        }
    }
}