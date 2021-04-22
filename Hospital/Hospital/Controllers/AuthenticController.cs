using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Hospital.Models;

namespace Hospital.Controllers
{
    public class AuthenticController : Controller
    {
        // GET: Authentic
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public int TestLogin(string id,string password,string type)
        {
            try
            {
                int ID = int.Parse(id);
                int Role = int.Parse(type);
                return Models.User.CheckExist(ID, password, Role) == true ? 1 : 0;

            } catch(Exception e)
            {
                return 0;
            }
        }

        [HttpPost]
        public ActionResult Login(string id, string password, string type)
        {
            int ID = int.Parse(id);
            int Role = int.Parse(type);
            if (Role == 2 && Models.User.CheckExist(ID, password, Role) == true)
            {
                Session["StaffID"] = ID;
                return RedirectToAction("Index", "Staff");
            }
            else if(Role == 1 && Models.User.CheckExist(ID, password, Role) == true)
            {
                Session["AdminID"] = ID;
                return RedirectToAction("Index", "Admin");
            }
            else
            {
                return null;
            }
        }
    }
}