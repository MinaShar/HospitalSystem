using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using Newtonsoft.Json;
using Hospital.Models;
using System.Text;
using System.IO.Compression;

namespace Hospital.Controllers
{
    public class StaffController : Controller
    {
        // GET: Staff
        public ActionResult Index()
        {
            ///////////////////THIS CODE MUST BE REMOVED/////////////////=>FOR TESTING ONLY
            if (Session["StaffID"] == null)
            {
                if (Request["ID"] == null)
                {
                    Session["StaffID"] = 15;
                }
                else
                {
                    Session["StaffID"] = int.Parse(Request["ID"].ToString());
                }
            }
            /////////////////////////////////////////////////////////////
            
            return View();
        }

        [HttpGet]
        public int CurrentSessionID()
        {
            return int.Parse(Session["StaffID"].ToString());
        }

        [HttpGet]
        public ActionResult SearchByID()
        {
            return View();
        }

        [HttpGet]
        public ActionResult PatientIDSearchResult(string id)
        {
            DataTable BasicData = Models.Patient.GetBasicData(id);
            if(BasicData.Rows.Count == 0)
            {
                return View("PatientNotFound");
            }
            DataTable Visits = Models.Visit.GetPatientVisits(id);
            ViewData["BasicData"] = BasicData;
            ViewData["Visits"] = Visits;
            return View();
        }

        [HttpGet]
        public ActionResult CreateNewVisit()
        {
            return View();
        }

        [HttpPost]
        public int SaveVisit()
        {
            string fileNameOnly = DateTime.Now.ToString().Replace("/", "-").Replace(" ", "- ").Replace(":", "") + ".png";
            string fileNameWitPath = HostingEnvironment.ApplicationPhysicalPath + "/Images/" + fileNameOnly; ///DateTime.Now.ToString().Replace("/", "-").Replace(" ", "- ").Replace(":", "") + ".png";

            string patientID = Request["PatientID"].ToString();
            int FieldID = Models.User.GetFiledIDOfStaff(int.Parse(Session["StaffID"].ToString()));
            string symptoms = Request["symptoms"];
            string prescriped = Request["prescriped"];
            string notes = Request["notes"];
            string imageData = Request["image"].ToString();

            Models.Visit.SaveNewVisit(patientID, FieldID, symptoms, prescriped, notes, fileNameOnly, int.Parse(Session["StaffID"].ToString()));

            using (FileStream fs = new FileStream(fileNameWitPath, FileMode.Create))
            {
                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    byte[] data = Convert.FromBase64String(imageData);
                    bw.Write(data);
                    bw.Close();
                }
            }

            return 1;
        }

        [HttpGet]
        public ActionResult ChatSearchResult(string Name)
        {
            DataTable dt = Models.User.SearchByName(Name, int.Parse(Session["StaffID"].ToString()));
            ViewData["Result"] = dt;
            return View();
        }

        [HttpGet]
        public ActionResult ChatBox(string id)
        {
            DataTable dt = Models.Chat.ChatBetween(int.Parse(Session["StaffID"].ToString()), int.Parse(id));
            ViewData["Messages"] = dt;
            ViewData["SessionID"] = Session["StaffID"];
            return View();
        }

        [HttpPost]
        public ActionResult SendMessage(string OtherID,string Message)
        {
            DataTable dt = Models.Chat.SendChatMessage(int.Parse(Session["StaffID"].ToString()), int.Parse(OtherID), Message);
            ViewData["Row"] = dt.Rows[0];
            ViewData["SessionID"] = Session["StaffID"];
            return PartialView("SendMessage");
        }

        [HttpGet]
        public ActionResult GetMessageByID(string id)
        {
            ViewData["Row"] = Models.Chat.GetMessageByID(int.Parse(id));
            ViewData["SessionID"] = Session["StaffID"];
            return PartialView("SendMessage");
        }

        [HttpGet]
        public ActionResult CreateNewPatient()
        {
            return View();
        }

        [HttpPost]
        public int PostCreateNewPatient()
        {
            string name = Request["first_name"].ToString() + " " + Request["last_name"].ToString();
            string id = Request["id"].ToString();
            string birthdate = Request["birthdate"].ToString();
            bool IsMale = String.Compare(Request["ismale"].ToString(), "1") == 0 ? true : false;
            string jop = Request["jop"].ToString();
            return Models.Patient.CreateNewPatient(id, name, birthdate, IsMale, jop);
        }

        [HttpGet]
        public ActionResult GetPeriodsTable()
        {
            return View("PeriodsTable");
        }

        [HttpPost]
        public int saveNewPeriod()
        {
            int day = int.Parse(Request["Day"].ToString());
            int period = int.Parse(Request["Period"].ToString());

            if( Models.Period.SaveNewPeriod(day, period, int.Parse(Session["StaffID"].ToString())) == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }

        }

        [HttpGet]
        public string GetStaffTable()
        {
            DataTable dt = Models.Period.GetStaffTable(int.Parse(Session["StaffID"].ToString()));
            return JsonConvert.SerializeObject(dt);
        }

        [HttpPost]
        public int deletePeriod()
        {
            if( Models.Period.DeletePeriod(int.Parse(Session["StaffID"].ToString()), int.Parse(Request["Day"].ToString()), int.Parse(Request["Period"].ToString())) == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }

        }

        [HttpGet]
        public ActionResult getProfilePage()
        {
            DataRow R = Models.User.GetBasciInformations(int.Parse(Session["StaffID"].ToString()));
            ViewData["Informations"] = R;
            return View("Profile");
        }

        [HttpPost]
        public int saveProfile()
        {
            string fileNameOnly = DateTime.Now.ToString().Replace("/", "-").Replace(" ", "- ").Replace(":", "") + ".png";
            string fileNameWitPath = HostingEnvironment.ApplicationPhysicalPath + "/Images/" + fileNameOnly;

            HttpPostedFileBase file = Request.Files["profileImg"];
           

            string Name = Request["name"].ToString();
            string Password = Request["password"].ToString();

            if(file != null)
            {
                Models.User.SaveNewProfile(int.Parse(Session["StaffID"].ToString()), Name, Password, fileNameOnly);
                file.SaveAs(fileNameWitPath);
            }
            else
            {
                Models.User.SaveNewProfile(int.Parse(Session["StaffID"].ToString()), Name, Password, null);
            }

            //using (FileStream fs = new FileStream(fileNameWitPath, FileMode.Create))
            //{
            //    using (BinaryWriter bw = new BinaryWriter(fs))
            //    {
            //        byte[] data = Convert.FromBase64String(imageData);
            //        bw.Write(data);
            //        bw.Close();
            //    }
            //}

            return 1;
        }

        [HttpGet]
        public ActionResult MailPage()
        {
            ViewData["Messages"] = Models.Mail.getStaffInbox(int.Parse(Session["StaffID"].ToString()));
            return View("MailPage");
        }

        [HttpGet]
        public ActionResult GetStaffSentMail()
        {
            ViewData["Messages"] = Models.Mail.getStaffSentMail(int.Parse(Session["StaffID"].ToString()));
            return PartialView("_TableOfMailPage");
        }

        [HttpGet]
        public ActionResult getInbox()
        {
            ViewData["Messages"] = Models.Mail.getStaffInbox(int.Parse(Session["StaffID"].ToString()));
            return PartialView("_TableOfMailPage");
        }

        [HttpGet]
        public ActionResult GetComposeMailFrm()
        {
            return View("ComposeMail");
        }

        [HttpPost]
        public int SaveNewMessage()
        {
            string PatientID = Request["patient_id"].ToString();
            string Title = Request["title"].ToString();
            string Message = Request["message"].ToString();
            int InsertedMessageID = Models.Mail.SaveNewStaffMessage(int.Parse(Session["StaffID"].ToString()), PatientID, Title, Message);
            if (InsertedMessageID != 1)
            {
                if (Request.Files.Count > 0)
                {
                    for (int i = 0; i < Request.Files.Count; i++)
                    {
                        var file = Request.Files[i];

                        if (file != null && file.ContentLength > 0)
                        {
                            //var fileName = Path.GetFileName(file.FileName);
                            string OldName = Path.GetFileName(file.FileName);
                            string[] fileInSplits = file.FileName.Split('.');
                            string Extension = fileInSplits[1];
                            string NewName = string.Format(@"{0}", Guid.NewGuid()) + "." + Extension;

                            var path = Path.Combine(Server.MapPath("~/Files/"), NewName);
                            //string fileNameWitPath = HostingEnvironment.ApplicationPhysicalPath + "/Files/" + NewName;
                            file.SaveAs(path);
                            //using (FileStream fs = new FileStream(fileNameWitPath, FileMode.Create))
                            //{
                            //    using (BinaryWriter bw = new BinaryWriter(fs))
                            //    {
                            //        byte[] data = Convert.FromBase64String(imageData);
                            //        bw.Write(data);
                            //        bw.Close();
                            //    }
                            //}

                            Attachement.AddAttachement(InsertedMessageID, OldName, NewName);

                        }

                    }
                }
                return 1;
            }
            else
            {
                return -1;
            }
        }

        [HttpGet]
        public ActionResult GetMail()
        {
            ViewData["Mail"] = Models.Mail.GetMail(int.Parse(Request["mailid"].ToString()));
            ViewData["Attachements"] = Models.Attachement.GetAttachements(int.Parse(Request["mailid"].ToString()));
            return View("MailViewerContainer");
        }

        [HttpGet]
        public FileResult DownloadAttachements(int mailid, string title)
        {
            string path = Server.MapPath("~/Files/");

            string myUniqueFileName = string.Format(@"{0}", Guid.NewGuid());
            DirectoryInfo di = Directory.CreateDirectory(path + myUniqueFileName);


            List<AttachementsList> AllAttachements = new List<AttachementsList>();
            DataTable Attacchements = Models.Attachement.GetAttachements(mailid);

            foreach (DataRow R in Attacchements.Rows)
            {

                string CompletePath = path + R["NewName"];
                byte[] fileBytes = System.IO.File.ReadAllBytes(path + R["NewName"]);

                string result = System.Text.Encoding.UTF8.GetString(fileBytes);
                //StringBuilder sb = new StringBuilder();

                //foreach (byte b in fileBytes)
                //{
                //    sb.Append(Convert.ToString(b, 2).PadLeft(8, '0'));
                //}

                AllAttachements.Add(new AttachementsList(int.Parse(R["ID"].ToString()), R["OldName"].ToString(), Encoding.UTF8.GetString(fileBytes), fileBytes));
            }

            foreach (AttachementsList L in AllAttachements)
            {
                System.IO.File.WriteAllBytes(path + myUniqueFileName + "/" + L.OldName, L.BytesArray);
            }

            ////// Now the folder is ready for zipping
            ZipFile.CreateFromDirectory(path + myUniqueFileName, path + myUniqueFileName + ".zip");

            List<AttachementsList> ZippedFolder = new List<AttachementsList>();
            byte[] zippedBytes = System.IO.File.ReadAllBytes(path + myUniqueFileName + ".zip");
            ZippedFolder.Add(new AttachementsList(-1, myUniqueFileName + ".zip", Encoding.UTF8.GetString(zippedBytes), zippedBytes));

            System.IO.File.WriteAllBytes(path + "test.zip", zippedBytes);

            return File(zippedBytes, System.Net.Mime.MediaTypeNames.Application.Octet, "re_" + title + ".zip");
        }

        [HttpGet]
        public ActionResult LogOut()
        {
            Session.Clear();
            return RedirectToAction("Index", "Authentic");
        }

        [HttpGet]
        public ActionResult getWeeks()
        {
            List<Object> dates = DateTime.Now.Calculate4ComingWeeks();
            List<Object> datesRequired = Models.Week.checkIfExistAndAddTheNew(dates);
            ViewData["dates"] = datesRequired;
            return View("pickWeek");
        }

        [HttpPost]
        public ActionResult ViewReservers()
        {
            int PeriodID = Period.getPeriodID(int.Parse(Request["day"].ToString()), int.Parse(Request["period"].ToString()), int.Parse(Session["StaffID"].ToString()));
            DataTable dt = Booking.GetReservers(PeriodID, int.Parse(Request["weekid"].ToString()));
            ViewData["Reservers"] = dt;
            return View("ViewReservers");
        }
    }
}