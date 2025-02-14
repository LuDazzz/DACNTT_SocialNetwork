using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialNetworkAPI.Models
{
    public class ReportPost
    {
        [Key]
        public int ReportID { get; set; }

        [ForeignKey("Reporter")]
        public int ReporterID { get; set; }
        public virtual User? Reporter { get; set; }

        [ForeignKey("Post")]
        public int PostID { get; set; }
        public virtual Post? Post { get; set; }

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;  // Lý do báo cáo
    }
}
