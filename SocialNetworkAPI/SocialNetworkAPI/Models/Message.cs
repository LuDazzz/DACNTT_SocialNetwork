using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Message
    {
        [Key]
        public int MessageID { get; set; }

        [ForeignKey("Sender")]
        public int SenderID { get; set; }

        [ForeignKey("Receiver")]
        public int ReceiverID { get; set; }

        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;

        public virtual User? Sender { get; set; }
        public virtual User? Receiver { get; set; }
    }
}
