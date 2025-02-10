using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class Share
    {
        [Key]
        public int ShareID { get; set; }

        [ForeignKey("User")]
        public int UserShareID { get; set; }

        [ForeignKey("Post")]
        public int PostID { get; set; }

        public virtual User User { get; set; }
        public virtual Post Post { get; set; }
    }
}
