using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class Chat
    {

        public static DataTable ChatBetween(int FromID,int ToID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"SELECT *,Chats.ID AS 'ChatID' FROM Chats
                                              INNER JOIN Users AS FromUser ON Chats.FromID = FromUser.ID
                                              INNER JOIN Users AS ToUser ON Chats.ToID = ToUser.ID
                                              WHERE(FromUser.ID = {0} AND ToUser.ID = {1}) OR(FromUser.ID = {1} AND ToUser.ID = {0})
                                              ORDER BY Chats.Time ASC", FromID, ToID);
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

        public static DataRow GetMessageByID(int id)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT *,Chats.ID AS 'ChatID' FROM Chats WHERE ID={0};", id);
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

                return dt.Rows[0];
            }
        }

        public static DataTable SendChatMessage(int FromID,int ToID,string Message)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("insert into Chats (FromID,ToID,Statement,Time) VALUES ({0},{1},'{2}',GETDATE())", FromID, ToID, Message);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }

                form = string.Format("select SCOPE_IDENTITY() AS 'ID'; ", FromID, ToID, Message);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        cmd.ExecuteNonQuery();
                        adabter.Fill(dt);
                    }
                }

                int LastRecordID = int.Parse(dt.Rows[0]["ID"].ToString());
                dt = new DataTable();
                form = string.Format("SELECT *,Chats.ID AS 'ChatID' FROM Chats WHERE ID={0};", LastRecordID);
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        cmd.ExecuteNonQuery();
                        adabter.Fill(dt);
                    }
                }

            }

            return dt;
        }
    }
}