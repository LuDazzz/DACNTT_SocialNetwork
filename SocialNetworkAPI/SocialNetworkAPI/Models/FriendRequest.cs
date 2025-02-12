using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class FriendRequest
    {
        [Key]
        public int RequestID { get; set; }

        [ForeignKey("Sender")]
        public int SenderID { get; set; }

        [ForeignKey("Receiver")]
        public int ReceiverID { get; set; }

        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public virtual User Sender { get; set; }
        public virtual User Receiver { get; set; }
    }
}
