using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hospital.Models
{
    public class AttachementsList
    {
        public int AttachementID { get; set; }
        public string OldName { get; set; }
        /// <summary>
        /// Encoded to UTF-8
        /// </summary>
        public string BinaryData { get; set; }
        public byte[] BytesArray { get; set; }

        public AttachementsList(int AttachementID, string OldName, string BinaryData, byte[] BytesArray)
        {
            this.AttachementID = AttachementID;
            this.OldName = OldName;
            this.BinaryData = BinaryData;
            this.BytesArray = BytesArray;
        }
    }
}