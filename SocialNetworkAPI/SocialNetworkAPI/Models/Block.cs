using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Block
    {
        [Key]
        public int BlockID { get; set; }

        [ForeignKey("User1")]
        public int UserID1 { get; set; }

        [ForeignKey("User2")]
        public int UserID2 { get; set; }

        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public virtual User User1 { get; set; }
        public virtual User User2 { get; set; }
    }
}
