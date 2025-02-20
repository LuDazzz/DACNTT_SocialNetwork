using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Block
    {
        [Key]
        public int BlockID { get; set; }

        [Required]
        public int UserID1 { get; set; }  // Người thực hiện chặn

        [Required]
        public int UserID2 { get; set; }  // Người bị chặn

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Quan hệ với bảng User
        public virtual User? Blocker { get; set; }
        public virtual User? BlockedUser { get; set; }
    }
}
