using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Hospital.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        public string StaffWorks()
        {
           
            DataTable dt = Models.User.getStaffWorks();
            return JsonConvert.SerializeObject(dt);
        }
        
        [HttpGet]
        public ActionResult AddNewUserFrm()
        {
            ViewData["Fields"] = Models.Field.GetAll();
            return View();
        }

        [HttpPost]
        public int CreateNewUser()
        {
            string Name = Request["fname"].ToString();
            Models.User.CreateNewUser(Name, Request["password"].ToString(), int.Parse(Request["role"].ToString()), int.Parse(Request["field_id"].ToString()));
            return 1;
        }

        [HttpGet]
        public ActionResult GetCreatePatientAccount()
        {
            return View("CreatePatientAccount");
        }

        [HttpGet]
        public Object SearchPatientByID(string ID)
        {
            // or => Request["ID"].ToString();
            DataTable BasicData = Models.Patient.GetBasicData(ID);
            if (BasicData.Rows.Count == 0)
            {
                object x =  new
                {
                    code = -1
                };

                return JsonConvert.SerializeObject(x);
            }
            ViewData["BasicData"] = BasicData;
            return View("PatientIDSearchResult");
        }

        [HttpPost]
        public int savePatientPassword()
        {
            if( Models.Patient.updatePatientPassword(Request["PatientID"].ToString(), Request["Password"].ToString()) == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }

        [HttpGet]
        public ActionResult LogOut()
        {
            Session.Clear();
            return RedirectToAction("Index", "Authentic");
        }
    }
}
