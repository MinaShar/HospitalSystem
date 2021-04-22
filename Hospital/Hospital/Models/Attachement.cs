using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Attachement
    {
        public static DataTable GetAttachements(int MailID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select * from Attachements where MailID={0};", MailID);
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

                if(dt.Rows.Count > 0)
                {
                    return dt;
                }
                else
                {
                    return null;
                }
            }
        }

        public static int AddAttachement(int MailID,string OldName,string NewName)
        {
            int id = -1;
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"insert into Attachements (MailID,OldName,NewName) Output Inserted.ID
                                                values({0},'{1}','{2}');", MailID, OldName, NewName);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        id = (int)cmd.ExecuteScalar();
                        //adabter.Fill(dt);
                    }
                }
            }
            return id;
        }
    }
}