using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Message
    {
        [Key]
        public int MessageID { get; set; }

        [Required]
        public int SenderID { get; set; }

        [Required]
        public int ReceiverID { get; set; }

        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public string? MediaType { get; set; } // text, emoji, image, audio, video, location

        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
