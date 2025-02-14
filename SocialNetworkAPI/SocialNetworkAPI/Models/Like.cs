using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Like
    {
        [Key]
        public int LikeID { get; set; }

        [ForeignKey("Post")]
        public int? PostID { get; set; }

        [ForeignKey("Comment")]
        public int? CommentID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Post? Post { get; set; }
        public virtual Comment? Comment { get; set; }
        public virtual User? User { get; set; }
    }
}
