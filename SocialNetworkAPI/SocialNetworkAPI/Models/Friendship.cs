using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Friendship
    {
        [Key]
        public int FriendshipID { get; set; }

        [Required]
        public int UserID1 { get; set; }

        [Required]
        public int UserID2 { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Thiết lập quan hệ với bảng User
        public virtual User? User1 { get; set; }
        public virtual User? User2 { get; set; }
    }
}
