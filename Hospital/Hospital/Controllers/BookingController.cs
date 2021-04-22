using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Hospital.Models;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.IO.Compression;
using System.Web.Hosting;

namespace Hospital.Controllers
{
    public class BookingController : Controller
    {
        // GET: Booking
        public ActionResult Index()
        {
            if (Session["PatientID"] != null)
            {
                string patientID = Session["PatientID"].ToString();
                ViewData["PatientID"] = patientID;
                ViewData["Name"] = Models.Patient.getName(patientID);
            }
            else
            {
                Session["PatientID"] = "08978978653643";

                string patientID = Session["PatientID"].ToString();
                ViewData["PatientID"] = patientID;
                ViewData["Name"] = Models.Patient.getName(patientID);
            }
            
            return View("Index");
        }

        [HttpGet]
        public ActionResult bookTimePage()
        {
            ViewData["AllDoctors"] = Models.User.getDoctors();
            return View("bookTimePage");
        }

        [HttpGet]
        public ActionResult getWeeks()
        {
            List<Object> dates = DateTime.Now.Calculate4ComingWeeks();
            List<Object> datesRequired = Models.Week.checkIfExistAndAddTheNew(dates);
            ViewData["dates"] = datesRequired;
            return View("pickWeek");
        }

        [HttpGet]
        public ActionResult getPeriodicTable()
        {
            return View("PeriodsTable");
        }

        [HttpGet]
        public string getStaffPeriodicTable()
        {
            DataTable dt = Models.Period.GetStaffTable(int.Parse(Request["staffid"].ToString()));
            return JsonConvert.SerializeObject(dt);
        }

        [HttpGet]
        public string getBookingsInCurrentTable()
        {
            DataTable dt = Models.Booking.BookingsInTable(int.Parse(Request["weekid"].ToString()), Session["PatientID"].ToString(), int.Parse(Request["staffid"].ToString()));
            return JsonConvert.SerializeObject(dt);
        }

        [HttpGet]
        public int checkThisPeriodIsBookedOrNot()
        {
            if( Models.Booking.CheckBookingOrNot(int.Parse(Request["weekid"].ToString()), int.Parse(Request["staffid"].ToString()), int.Parse(Request["day"].ToString()), int.Parse(Request["period"].ToString()), Session["PatientID"].ToString()) == true)
            {
                ///// BOOKING
                return 1;
            }
            else
            {
                ///// NOT BOOKING
                return -1;
            }
        }

        [HttpPost]
        public int saveNewBook()
        {
            int PeriodID = Models.Period.getPeriodID(int.Parse(Request["day"].ToString()), int.Parse(Request["period"].ToString()), int.Parse(Request["staffid"].ToString()));
            if(Models.Booking.AddNewBook(int.Parse(Request["weekid"].ToString()), PeriodID, Session["PatientID"].ToString()) == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }

        [HttpPost]
        public int deleteBook()
        {
            int PeriodID = Models.Period.getPeriodID(int.Parse(Request["day"].ToString()), int.Parse(Request["period"].ToString()), int.Parse(Request["staffid"].ToString()));
            if(Models.Booking.deleteBook(int.Parse(Request["weekid"].ToString()), PeriodID, Session["PatientID"].ToString()) == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }

        [HttpGet]
        public ActionResult GetReminder()
        {
            List<Reminder> reminders = Booking.getAllBookingsOfPatient(Session["PatientID"].ToString());
            ViewData["Reminders"] = reminders;
            return View("Reminder");
        }

        [HttpGet]
        public string GetEntranceMessage()
        {
            Reminder R = Models.Booking.BookingOfPatientToday(Session["PatientID"].ToString());
            return JsonConvert.SerializeObject(R);
        }

        [HttpGet]
        public ActionResult SystemMail()
        {
            ViewData["Messages"] = Models.Mail.GetPatientInbox(Session["PatientID"].ToString());
            return View("MailPage");
        }

        [HttpGet]
        public ActionResult GetPatientInbox()
        {
            ViewData["Messages"] = Models.Mail.GetPatientInbox(Session["PatientID"].ToString());
            return PartialView("_TableOfMailPage");
        }

        [HttpGet]
        public ActionResult GetPatientSentMail()
        {
            ViewData["Messages"] = Models.Mail.GetPatientSentMail(Session["PatientID"].ToString());
            return PartialView("_TableOfMailPage");
        }

        [HttpGet]
        public ActionResult GetComposeMailForm()
        {
            return View("ComposeMail");
        }

        [HttpPost]
        public int SaveNewMessage()
        {
            int InsertedMessageID = -1;
            if((InsertedMessageID = Models.Mail.SaveNewPatientMessage(int.Parse(Request["staff_id"].ToString()), Session["PatientID"].ToString(), Request["title"], Request["message"])) != 1)
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
            else { return -1; }
        }

        [HttpGet]
        public ActionResult GetMail()
        {
            ViewData["Mail"] = Models.Mail.GetMail(int.Parse(Request["mailid"].ToString()));
            ViewData["Attachements"] = Models.Attachement.GetAttachements(int.Parse(Request["mailid"].ToString()));
            return View("MailViewerContainer");
        }

        [HttpGet]
        public FileResult DownloadAttachements(int mailid,string title)
        {
            string path = Server.MapPath("~/Files/");

            string myUniqueFileName = string.Format(@"{0}", Guid.NewGuid());
            DirectoryInfo di = Directory.CreateDirectory(path+myUniqueFileName);


            List<AttachementsList> AllAttachements = new List<AttachementsList>();
            DataTable Attacchements = Models.Attachement.GetAttachements(mailid);

            foreach(DataRow R in Attacchements.Rows)
            {
                
                string CompletePath = path + R["NewName"];
                byte[] fileBytes = System.IO.File.ReadAllBytes(path+R["NewName"]);

                string result = System.Text.Encoding.UTF8.GetString(fileBytes);
                //StringBuilder sb = new StringBuilder();

                //foreach (byte b in fileBytes)
                //{
                //    sb.Append(Convert.ToString(b, 2).PadLeft(8, '0'));
                //}

                AllAttachements.Add(new AttachementsList(int.Parse(R["ID"].ToString()), R["OldName"].ToString(),Encoding.UTF8.GetString(fileBytes),fileBytes));
            }

            foreach(AttachementsList L in AllAttachements)
            {
                System.IO.File.WriteAllBytes(path + myUniqueFileName+"/"+L.OldName, L.BytesArray);
            }

            ////// Now the folder is ready for zipping
            ZipFile.CreateFromDirectory(path + myUniqueFileName, path + myUniqueFileName+".zip");

            List<AttachementsList> ZippedFolder = new List<AttachementsList>();
            byte[] zippedBytes = System.IO.File.ReadAllBytes(path + myUniqueFileName + ".zip");
            ZippedFolder.Add(new AttachementsList(-1, myUniqueFileName + ".zip", Encoding.UTF8.GetString(zippedBytes), zippedBytes));

            System.IO.File.WriteAllBytes(path + "test.zip", zippedBytes);

            return File(zippedBytes, System.Net.Mime.MediaTypeNames.Application.Octet, "re_"+title+".zip");
        }

        [HttpGet]
        public ActionResult LogOut()
        {
            Session.Clear();
            return RedirectToAction("Index", "BookingAuth");
        }
    }
}