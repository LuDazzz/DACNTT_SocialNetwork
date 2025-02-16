using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SocialNetworkAPI.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required, MaxLength(50)]
        public string? Username { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public byte[]? CoverPhoto { get; set; }
        public DateTime? Dob { get; set; }
        public bool IsOnline { get; set; }
        public DateTime DateTimeCreate { get; set; } = DateTime.Now;
        public string? Gender { get; set; }
        public string? ResetCode { get; set; }
        public bool IsPrivate { get; set; } = false;
        public int FriendsCount { get; set; } = 0;
        public DateTime? LastLogin { get; set; } = DateTime.Now;

        [JsonIgnore]
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

        [JsonIgnore]
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
        public class RegisterRequest
        {
            public string? Username { get; set; }
            public string? Password { get; set; }
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Email { get; set; }
            public string? Gender { get; set; }
            public DateTime? Dob { get; set; }
        }

        public class LoginRequest
        {
            public string? Email { get; set; } // Only email is required
            public string? Password { get; set; }
        }

        public class ForgotPasswordRequest
        {
            public string? Email { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string? Email { get; set; }
            public string? ResetCode { get; set; }
            public string? NewPassword { get; set; }
        }
    }
}
