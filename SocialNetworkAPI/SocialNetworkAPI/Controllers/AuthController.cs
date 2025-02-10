using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Models;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static SocialNetworkAPI.Models.User;

namespace SocialNetworkAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check if any required field is missing
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Gender) ||
                request.Dob == null)
            {
                return BadRequest(new { message = "All fields are required." });
            }

            // Check if email already exists
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already in use." });
            }

            // Check if username already exists
            if (_context.Users.Any(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Username already taken." });
            }

            // Create new user
            var user = new User
            {
                Username = request.Username,
                Password = request.Password,  // Not hashed as per your request
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Gender = request.Gender,
                Dob = request.Dob,
                DateTimeCreate = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .Select(u => new
                {
                    u.UserID,
                    u.Username,
                    u.Email,
                    u.Password,
                    u.FirstName,
                    u.LastName,
                    ProfilePictureURL = u.ProfilePictureURL ?? string.Empty, // Handle NULL
                    PhoneNumber = u.PhoneNumber ?? string.Empty // Handle NULL if needed
                })
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return NotFound(new { message = "User not found." });

            if (user.Password != request.Password)
                return Unauthorized(new { message = "Invalid password." });

            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    user.UserID,
                    user.Username,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.ProfilePictureURL
                }
            });
        }


        [HttpPost("reset-password-request")]
        public async Task<IActionResult> ResetPasswordRequest([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return NotFound(new { message = "Email không tồn tại." });

            // Tạo mã reset ngẫu nhiên (6 chữ số)
            Random random = new Random();
            string resetCode = random.Next(100000, 999999).ToString();

            user.ResetCode = resetCode;
            await _context.SaveChangesAsync();

            // Gửi email chứa mã xác nhận
            var emailService = new EmailService();
            await emailService.SendEmailAsync(user.Email, "Mã xác nhận đặt lại mật khẩu", $"Mã xác nhận của bạn là: {resetCode}");

            return Ok(new { message = "Mã xác nhận đã được gửi đến email của bạn." });
        }


        // Xác nhận mã và đặt lại mật khẩu mới
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.ResetCode == request.ResetCode);
            if (user == null)
                return BadRequest(new { message = "Mã xác nhận không hợp lệ." });

            // Cập nhật mật khẩu mới
            user.Password = request.NewPassword;
            user.ResetCode = null;  // Xóa reset code sau khi đặt lại mật khẩu
            await _context.SaveChangesAsync();

            return Ok(new { message = "Mật khẩu đã được đặt lại thành công." });
        }


    }
}
