using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;


namespace Hospital.Models
{
    public class Patient
    {

        public static DataTable GetBasicData(string ID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT * FROM Patients WHERE ID='{0}';", ID);
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

        public static int CreateNewPatient(string id,string name,string birthdate,bool IsMale,string jop)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("INSERT INTO Patients (ID,Name,Birthdate,IsMale,Jop) VALUES ('{0}','{1}','{2}','{3}','{4}');", id, name, birthdate, IsMale, jop);
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

        public static int updatePatientPassword(string PatientID,string Password)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"UPDATE Patients
                                              SET Password = '{0}'
                                              WHERE ID = '{1}';", Password, PatientID);
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

        public static string getName(string id)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT * FROM Patients WHERE ID='{0}';", id);
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

            return dt.Rows[0]["Name"].ToString();
        }

        public static int checkCredentials(string id,string password)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT * FROM Patients WHERE ID='{0}' and Password='{1}';", id, password);
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
            if (dt.Rows.Count > 0)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
    }
}