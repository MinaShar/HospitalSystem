using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class User
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int Role { get; set; }

        public static bool CheckExist(int ID,string Password,int type)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT * FROM Users WHERE ID={0} AND Password='{1}' AND Role={2};",ID,Password,type);
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
                    return true;
                }
                else
                {
                    return false;
                }

                //var myEnumerable = dt.AsEnumerable();
                //List<User> StudentList =
                //    (from item in myEnumerable
                //     select new User
                //     {
                //         ID = item.Field<int>("Id"),
                //         Name = item.Field<string>("Name"),
                //         Password = item.Field<string>("Password"),
                //         Role = item.Field<int>("DepartmentId")
                //     }).ToList();
                //return StudentList[0];
            }
        }

        public static void GetAll()
        {
            //DataTable dt = new DataTable();
            //string connstring = "Data Source=.;Initial Catalog=SSP;Integrated Security=True";
            //using (SqlConnection conn = new SqlConnection(connstring))
            //{
            //    string form = string.Format("SELECT * FROM Students WHERE Id={0};", ID);
            //    using (SqlCommand cmd = new SqlCommand(form))
            //    {
            //        cmd.Connection = conn;
            //        using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
            //        {
            //            conn.Open();
            //            cmd.ExecuteNonQuery();
            //            adabter.Fill(dt);
            //        }
            //    }

            //    var myEnumerable = dt.AsEnumerable();
            //    List<User> StudentList =
            //        (from item in myEnumerable
            //         select new User
            //         {
            //             ID = item.Field<int>("Id"),
            //             Name = item.Field<string>("Name"),
            //             Password = item.Field<string>("Password"),
            //             Role = item.Field<int>("DepartmentId")
            //         }).ToList();
            //    return StudentList[0];
            //}
        }

        public static int GetFiledIDOfStaff(int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT * FROM Users WHERE ID={0};", StaffID);
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

                if (dt.Rows.Count > 0)
                {
                    return int.Parse(dt.Rows[0]["FieldID"].ToString());
                }
                else
                {
                    return -1;
                }
            }
        }

        public static DataTable SearchByName(string Name,int ExeptedID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT *,Fields.Name AS FieldName,Users.Name As UserName,Users.ID AS UserID FROM Users INNER JOIN Fields ON Users.FieldID=Fields.ID WHERE Users.Name LIKE '{0}%' AND Users.ID NOT IN ({1});", Name, ExeptedID);
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

        /// <summary>
        /// 
        //             ANOTHER QUERY THAT DO SAME THING
        //        select U.Name, COUNT(V.StaffID) from Users U
        //        left outer join Visits V ON U.ID = V.StaffID
        //        WHERE U.Role= 2
        //        GROUP BY V.StaffID, U.ID, U.Name;
        /// </summary>
        /// <returns></returns>
        public static DataTable getStaffWorks()
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format("SELECT * FROM Users WHERE Users.Role = 2;");
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

                dt.Columns.Add("NumberOfVisits");

                int index = 0;

                foreach(DataRow R in dt.Rows)
                {
                    DataTable ADT = new DataTable();

                    string form2 = string.Format("SELECT COUNT(*) AS Number FROM Visits WHERE Visits.StaffID={0};",R["ID"]);
                    using (SqlCommand cmd = new SqlCommand(form2))
                    {
                        cmd.Connection = conn;
                        using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                        {
                            cmd.ExecuteNonQuery();
                            adabter.Fill(ADT);
                        }
                    }

                    dt.Rows[index]["NumberOfVisits"] = ADT.Rows[0].Field<int>("Number");
                    index++;
                }

                return dt;
            }
        }

        public static int CreateNewUser(string Name,string Password,int Role,int? FieldID)
        {
            if(Role!= 2)
            {
                FieldID = null;
            }
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form;
                if (FieldID != null)
                {
                    form = string.Format("INSERT INTO Users ( Name , Password , Role , FieldID , Image ) VALUES ('{0}','{1}',{2},{3},'profile.jpg');", Name, Password, Role, FieldID);
                }
                else
                {
                    form = string.Format("INSERT INTO Users ( Name , Password , Role , Image ) VALUES ('{0}','{1}',{2},'profile.jpg');", Name, Password, Role);
                }
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

        public static DataTable getDoctors()
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select Users.*,Fields.Name as 'FieldName'
                                              from Users
                                              inner join Fields on Fields.ID = Users.FieldID
                                              where Users.Role=2;");
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

        public static DataRow GetBasciInformations(int StaffID)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form = string.Format(@"select *
                                              from Users
                                              where Users.ID={0};", StaffID);
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

        public static int SaveNewProfile(int UserID,string name,string password,string ImageName)
        {
            DataTable dt = new DataTable();
            string connstring = "Data Source=.;Initial Catalog=Hospital;Integrated Security=True";
            using (SqlConnection conn = new SqlConnection(connstring))
            {
                string form;
                if (ImageName != null)
                {
                     form = string.Format(@"Update Users set Name='{0}' , Password='{1}' , Image='{2}'
                                              where Users.ID={3};", name, password, ImageName, UserID);
                }
                else
                {
                    form = string.Format(@"Update Users set Name='{0}' , Password='{1}'
                                              where Users.ID={2};", name, password, UserID);
                }
                using (SqlCommand cmd = new SqlCommand(form))
                {
                    cmd.Connection = conn;
                    using (SqlDataAdapter adabter = new SqlDataAdapter(cmd))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }

                return 1;
            }
        }
    }
}