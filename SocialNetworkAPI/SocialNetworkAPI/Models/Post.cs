using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SocialNetworkAPI.Models
{
    public class Post
    {
        [Key]
        public int PostID { get; set; }

        [Required]
        public int UserID { get; set; }

        [ForeignKey("UserID")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public virtual User? User { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? MediaType { get; set; }

        public string? MediaURL { get; set; }

        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public bool IsUpdated { get; set; } = false;

        public DateTime? DateTimeUpdated { get; set; }

        public int LikeCounter { get; set; } = 0;

        public int CommentCounter { get; set; } = 0;

        public int ShareCounter { get; set; } = 0;

        // Navigation properties
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}