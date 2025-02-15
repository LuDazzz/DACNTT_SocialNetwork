using System.ComponentModel.DataAnnotations;

namespace SocialNetworkAPI.Models
{
    public class ReportListUser
    {
        [Key]
        public int ReportID { get; set; }

        [Required]
        public int SenderID { get; set; }  // Người báo cáo

        [Required]
        public int UserIsReported { get; set; }  // Người bị báo cáo

        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;  // Lý do báo cáo

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Thiết lập quan hệ với User
        public virtual User? Reporter { get; set; }
        public virtual User? ReportedUser { get; set; }
    }
}
