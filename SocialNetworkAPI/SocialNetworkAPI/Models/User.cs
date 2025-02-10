using System.ComponentModel.DataAnnotations;

namespace SocialNetworkAPI.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureURL { get; set; }
        public DateTime Dob { get; set; }
        public bool IsOnline { get; set; }
        public DateTime DateTimeCreate { get; set; } = DateTime.UtcNow;
        public string Gender { get; set; }
        public string? ResetCode { get; set; }
        public bool IsPrivate { get; set; }
        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Gender { get; set; }
            public DateTime Dob { get; set; }
        }

        public class LoginRequest
        {
            public string Email { get; set; } // Only email is required
            public string Password { get; set; }
        }

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string Email { get; set; }
            public string ResetCode { get; set; }
            public string NewPassword { get; set; }
        }
    }
}
