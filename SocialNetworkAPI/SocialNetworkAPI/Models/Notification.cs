using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Notification
    {
        [Key]
        public int NotiID { get; set; }

        [Required]
        public int UserID { get; set; }  // Người nhận thông báo

        [Required]
        public int SenderID { get; set; }  // Người gửi thông báo (người like bài viết,...)

        [Required]
        public string Content { get; set; }  // Nội dung thông báo

        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public string Type { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;
    }
}
