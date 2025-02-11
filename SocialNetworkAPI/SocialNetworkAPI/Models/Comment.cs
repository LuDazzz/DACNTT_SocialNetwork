using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SocialNetworkAPI.Models
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }

        [ForeignKey("Post")]
        public int PostID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public string Content { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public bool IsUpdated { get; set; } = false;
        public DateTime? DateTimeUpdated { get; set; }

        // Reply có thể là 1 Comment khác hoặc Post
        public int? ReplyForID { get; set; }

        // Navigation Properties
        [JsonIgnore]
        public virtual Post? Post { get; set; }
        public virtual User? User { get; set; }
        public virtual ICollection<Like>? Likes { get; set; }
    }
}
