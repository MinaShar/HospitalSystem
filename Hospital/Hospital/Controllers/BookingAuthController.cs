using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Hospital.Controllers
{
    public class BookingAuthController : Controller
    {
        // GET: BookingAuth
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public int TestLogin()
        {
            if (Models.Patient.checkCredentials(Request["id"].ToString(), Request["password"].ToString()) == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }

        [HttpPost]
        public Object Login()
        {
            if (Models.Patient.checkCredentials(Request["patientid"].ToString(), Request["password"].ToString()) == 1)
            {
                Session["PatientID"] = Request["patientid"].ToString();
                return RedirectToAction("Index", "Booking");
            }
            else
            {
                return -1;
            }
        }
    }
}