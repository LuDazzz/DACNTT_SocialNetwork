using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;

//using System.IO.File.ReadAllBytes;
using System.Text;
using System.Threading.Tasks;
using static SocialNetworkAPI.Models.User;

namespace SocialNetworkAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        private readonly ApplicationDbContext _context;

        
        private byte[] GetDefaultProfilePicture()
        {
            string defaultImagePath = Path.Combine(Directory.GetCurrentDirectory(), "DefaultAvatar", "profile.jpg");

            if (!System.IO.File.Exists(defaultImagePath))
            {
                throw new FileNotFoundException("Default profile picture not found.");
            }

            return System.IO.File.ReadAllBytes(defaultImagePath);
        }
        
        private byte[] GetDefaultPhoto()
        {
            string defaultImagePath1 = Path.Combine(Directory.GetCurrentDirectory(), "DefaultAvatar", "coverPhoto.jpg");
            if (!System.IO.File.Exists(defaultImagePath1))
            {
                throw new FileNotFoundException("Default profile picture not found.");
            }

            return System.IO.File.ReadAllBytes(defaultImagePath1);
        }

        [HttpGet("getUserById/{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _context.Users
                .Where(u => u.UserID == userId)
                .Select(u => new
                {
                    u.UserID,
                    u.Username,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Gender,
                    u.Dob,
                    u.Bio,
                    u.ProfilePicture,
                    u.IsPrivate,
                    u.IsOnline,
                    u.DateTimeCreate
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpGet("getPostByUserId/{userId}")]
        public async Task<IActionResult> GetPostByUserId(int userId)
        {
            var posts = await _context.Posts
                .Where(p => p.UserID == userId)
                .Select(p => new
                {
                    p.PostID,
                    p.UserID,
                    p.Content,
                    p.MediaType,
                    p.MediaURL,
                    p.DateTime,
                    p.IsUpdated,
                    p.DateTimeUpdated,
                    p.LikeCounter,
                    p.CommentCounter,
                    p.ShareCounter,
                    p.User!.Username,
                    p.User!.ProfilePicture
                })
                .ToListAsync();

            if (!posts.Any())
            {
                return NotFound(new { message = "No posts found for this user." });
            }

            return Ok(posts);
        }

        [HttpGet("GetFriendByUserId/{userId}")]
        public async Task<IActionResult> GetFriendByUserId(int userId)
        {
            var friends = await (from f in _context.Friendships
                                 join u in _context.Users on
                                 (f.UserID1 == userId ? f.UserID2 : f.UserID1) equals u.UserID
                                 where f.UserID1 == userId || f.UserID2 == userId
                                 select new
                                 {
                                     FriendID = u.UserID,
                                     Username = u.Username,
                                     FirstName = u.FirstName,
                                     LastName = u.LastName,
                                     ProfilePicture = u.ProfilePicture
                                 }).ToListAsync();

            return Ok(friends);
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

            byte[] defaultProfilePicture = GetDefaultProfilePicture();
            byte[] defualtCoverPhoto = GetDefaultPhoto();

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
                Password = request.Password,  
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Gender = request.Gender,
                Dob = request.Dob,
                ProfilePicture = defaultProfilePicture,
                CoverPhoto = defualtCoverPhoto,
                DateTimeCreate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Truy vấn đối tượng User thực tế từ cơ sở dữ liệu
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return NotFound(new { message = "User not found." });

            if (user.Password != request.Password)
                return Unauthorized(new { message = "Invalid password." });

            // Cập nhật trạng thái IsOnline và LastLogin
            user.IsOnline = true;
            user.LastLogin = DateTime.Now;

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Tạo JWT Token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                message = "Login successful",
                token = tokenString,
                user = new
                {
                    user.UserID,
                    user.Username,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                }
            });
        }


        [HttpPost("logout/{userId}")]
        public async Task<IActionResult> Logout(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            user.IsOnline = false;
            user.LastLogin = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok("Logout successful");
        }

        [HttpGet("friends-status/{userId}")]
        public async Task<IActionResult> GetFriendsStatus(int userId)
        {
            var friends = await _context.Friendships
                .Where(f => f.UserID1 == userId || f.UserID2 == userId)
                .Select(f => f.UserID1 == userId ? f.UserID2 : f.UserID1)
                .ToListAsync();

            var friendStatuses = await _context.Users
                .Where(u => friends.Contains(u.UserID))
                .Select(u => new
                {
                    u.UserID,
                    u.Username,
                    u.IsOnline,
                    LastLogin = u.LastLogin.HasValue ? u.LastLogin.Value.ToString("yyyy-MM-dd HH:mm:ss") : "Unknown"
                })
                .ToListAsync();

            return Ok(friendStatuses);
        }



        [HttpPost("reset-password-request")]
        public async Task<IActionResult> ResetPasswordRequest([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return NotFound(new { message = "Email does not exist. Please try again." });

            // Tạo mã reset ngẫu nhiên (6 chữ số)
            Random random = new Random();
            string resetCode = random.Next(100000, 999999).ToString();

            user.ResetCode = resetCode;
            await _context.SaveChangesAsync();

            // Gửi email chứa mã xác nhận
            var emailService = new EmailService();
            await emailService.SendEmailAsync(user.Email!, "The code to reset the Password", $"Your confirmation code is: {resetCode}");

            return Ok(new { message = "The reset code has been sent to your email." });
        }


        // Xác nhận mã và đặt lại mật khẩu mới
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.ResetCode == request.ResetCode);
            if (user == null)
                return BadRequest(new { message = "Invalid code." });

            // Cập nhật mật khẩu mới
            user.Password = request.NewPassword;
            user.ResetCode = null;  // Xóa reset code sau khi đặt lại mật khẩu
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reset Password successfully" });
        }


    }
}
