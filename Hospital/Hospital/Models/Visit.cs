using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Visit
    {
        public static DataTable GetPatientVisits(string PatientID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT *,Fields.Name AS 'FieldName',Visits.ID AS 'VisitID' FROM Visits INNER JOIN Fields ON Visits.FieldID=Fields.ID WHERE PatientID='{0}' ORDER BY Date DESC,Visits.ID DESC;", PatientID);
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

        public static int SaveNewVisit(string PatientID,int FieldID,string Symptoms,string Prescriped,string Notes,string Image,int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("INSERT INTO Visits ( PatientID , Date , FieldID , Symptoms , Prescriped , Notes , Image , StaffID ) VALUES ('{0}',GETDATE(),{1},'{2}','{3}','{4}','{5}',{6});", PatientID, FieldID, Symptoms, Prescriped, Notes, Image, StaffID);
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
    }
}