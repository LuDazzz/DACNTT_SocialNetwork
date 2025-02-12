using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class ReportListUser
    {
        [Key]
        public int ReportID { get; set; }

        [ForeignKey("Sender")]
        public int SenderID { get; set; }
        public virtual User Sender { get; set; }

        [ForeignKey("ReportedUser")]
        public int ReportedUserID { get; set; }  // Đổi tên để tránh trùng lặp
        public virtual User ReportedUser { get; set; }  // Đổi tên entity để rõ ràng
    }
}
