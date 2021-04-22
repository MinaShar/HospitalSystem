using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Mail
    {

        public static DataTable getStaffInbox(int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select Patients.Name AS 'PatientName',Mails.Title AS 'Title',Mails.Message AS 'Message',Mails.ID AS 'MailID'
                                            from Mails
                                            inner join Users ON Mails.StaffID=Users.ID
                                            inner join Patients ON Mails.PatinetID=Patients.ID
                                            where Mails.StaffID={0} and Mails.FlagSender=0
                                            ORDER BY Mails.Date DESC,Mails.ID DESC;", StaffID);
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

        public static DataTable getStaffSentMail(int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select Patients.Name AS 'PatientName',Mails.Title AS 'Title',Mails.Message AS 'Message',Mails.ID AS 'MailID'
                                            from Mails
                                            inner join Users ON Mails.StaffID=Users.ID
                                            inner join Patients ON Mails.PatinetID=Patients.ID
                                            where Mails.StaffID={0} and Mails.FlagSender=1
                                            ORDER BY Mails.Date DESC,Mails.ID DESC;", StaffID);
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

        public static int SaveNewStaffMessage(int StaffID,string PatientID,string Title,string Message)
        {
            int id = -1;
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"INSERT into Mails (StaffID,PatinetID,FlagSender,Title,Message,Date,IsRead) Output Inserted.ID
                                                values ('{0}','{1}',1,'{2}','{3}',GETDATE(),0);", StaffID, PatientID, Title, Message);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        id = (int)cmd.ExecuteScalar();
                    }
                }
            }
            return id;
        }

        public static DataTable GetPatientInbox(string PatientID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select Users.Name AS 'StaffName',Mails.Title AS 'Title',Mails.Message AS 'Message',Mails.ID AS 'MailID'
                                            from Mails
                                            inner join Users ON Mails.StaffID=Users.ID
                                            inner join Patients ON Mails.PatinetID=Patients.ID
                                            where Mails.PatinetID='{0}' and Mails.FlagSender=1
                                            ORDER BY Mails.Date DESC,Mails.ID DESC;", PatientID);
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

        public static DataTable GetPatientSentMail(string PatientID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select Users.Name AS 'StaffName',Mails.Title AS 'Title',Mails.Message AS 'Message',Mails.ID AS 'MailID'
                                            from Mails
                                            inner join Users ON Mails.StaffID=Users.ID
                                            inner join Patients ON Mails.PatinetID=Patients.ID
                                            where Mails.PatinetID='{0}' and Mails.FlagSender=0
                                            ORDER BY Mails.Date DESC,Mails.ID DESC;", PatientID);
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

        public static int SaveNewPatientMessage(int StaffID,string PatientID,string Title,string Message)
        {
            int id = -1;
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"insert into Mails (StaffID,PatinetID,FlagSender,Title,Message,Date,IsRead) Output Inserted.ID
                                            values ('{0}','{1}',0,'{2}','{3}',GETDATE(),0);", StaffID, PatientID, Title, Message);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        id = (int)cmd.ExecuteScalar();
                    }
                }

                return id;
            }
        }

        public static DataRow GetMail(int MailID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"SELECT FlagSender AS 'Flag' from Mails where Mails.ID={0};", MailID);
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

                int Flag = int.Parse(dt.Rows[0]["Flag"].ToString());
                dt = new DataTable();
                switch (Flag)
                {
                    case 0:
                        form = string.Format(@"select Patients.Name AS 'Sender',Mails.Title AS 'Title',Mails.Message AS 'Message',Mails.ID AS 'MailID'
                                                from Mails
                                                inner join Patients ON Patients.ID=Mails.PatinetID
                                                WHERE Mails.ID={0};", MailID);
                        using (SqlCommand cmd = new SqlCommand(form))
                        {
                            cmd.Connection = conn;
                            using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                            {
                                //conn.Open();
                                cmd.ExecuteNonQuery();
                                adabter.Fill(dt);
                            }
                        }
                        return dt.Rows[0];
                    case 1:
                        form = string.Format(@"select Users.Name AS 'Sender',Mails.Title AS 'Title',Mails.Message AS 'Message',Mails.ID AS 'MailID'
                                                from Mails
                                                inner join Users ON Users.ID=Mails.StaffID
                                                WHERE Mails.ID={0};", MailID);
                        using (SqlCommand cmd = new SqlCommand(form))
                        {
                            cmd.Connection = conn;
                            using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                            {
                                //conn.Open();
                                cmd.ExecuteNonQuery();
                                adabter.Fill(dt);
                            }
                        }
                        return dt.Rows[0];
                }

                return null;
            }
        }
    }
}