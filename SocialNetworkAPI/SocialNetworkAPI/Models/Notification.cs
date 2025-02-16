using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Notification
    {
        [Key]
        public int NotiID { get; set; }

        public string Content { get; set; } = string.Empty;
        public DateTime DateTime { get; set; } = DateTime.Now;

        [ForeignKey("User")]
        public int UserID { get; set; }

        public virtual User? User { get; set; }
    }
}
