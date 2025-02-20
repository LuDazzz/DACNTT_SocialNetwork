using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("update-avatar")]
        public async Task<IActionResult> UpdateAvatar([FromForm] int userId, [FromForm] IFormFile profilePicture)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            using (var memoryStream = new MemoryStream())
            {
                await profilePicture.CopyToAsync(memoryStream);
                user.ProfilePicture = memoryStream.ToArray();
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile picture updated successfully." });
        }

        [HttpPost("update-cover-photo")]
        public async Task<IActionResult> UpdateCoverPhoto([FromForm] int userId, [FromForm] IFormFile coverPhoto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            using (var memoryStream = new MemoryStream())
            {
                await coverPhoto.CopyToAsync(memoryStream);
                user.CoverPhoto = memoryStream.ToArray();
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cover photo updated successfully." });
        }


        [HttpPost("updateBio")]
        public async Task<IActionResult> UpdateBio([FromBody] UpdateBioRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserID);
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.Bio = request.Bio;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Bio updated successfully" });
        }

        [HttpGet("searchUser")]
        public async Task<IActionResult> SearchUser([FromQuery] string keyword, [FromQuery] int currentUserId)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest(new { message = "Search keyword cannot be empty." });
            }

            try
            {
                var users = await _context.Users
                    .Where(u => (u.Username.Contains(keyword) ||
                                 u.FirstName.Contains(keyword) ||
                                 u.LastName.Contains(keyword)) &&
                                u.UserID != currentUserId &&  // Loại bỏ chính user hiện tại
                                !u.IsAdmin)  // Loại bỏ admin
                    .Select(u => new
                    {
                        u.UserID,
                        u.Username,
                        u.FirstName,
                        u.LastName,
                        u.ProfilePicture
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching for users.", error = ex.Message });
            }
        }


        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserID);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Kiểm tra nếu username được gửi lên và có trùng không
            if (!string.IsNullOrEmpty(request.Username))
            {
                var existingUser = await _context.Users.AnyAsync(u => u.Username == request.Username && u.UserID != request.UserID);
                if (existingUser)
                {
                    return BadRequest("Username already exists.");
                }
                user.Username = request.Username;
            }

            // Cập nhật nếu giá trị không null hoặc rỗng
            if (!string.IsNullOrEmpty(request.FirstName))
            {
                user.FirstName = request.FirstName;
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                user.LastName = request.LastName;
            }

            if (!string.IsNullOrEmpty(request.Bio))
            {
                user.Bio = request.Bio;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpGet("getSharedPosts")]
        public async Task<IActionResult> GetSharedPostsByUserID([FromQuery] int userId)
        {
            try
            {
                var sharedPosts = await _context.Shares
                    .Where(s => s.UserShareID == userId)
                    .Join(_context.Posts,
                          s => s.PostID,
                          p => p.PostID,
                          (s, p) => new
                          {
                              p.PostID,
                              p.UserID,
                              p.Content,
                              p.MediaType,
                              p.MediaURL,
                              p.DateTime,
                              p.IsUpdated,
                              p.DateTimeUpdated
                          })
                    .ToListAsync();

                return Ok(sharedPosts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving shared posts.", error = ex.Message });
            }
        }


    }

    public class UpdateUserProfileRequest
    {
        public int UserID { get; set; }
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Bio { get; set; }
    }





    public class UpdateProfilePicturesRequest
    {
        public int UserID { get; set; }
        public byte[]? Avatar { get; set; }
        public byte[]? CoverPhoto { get; set; }
    }

    public class UpdateBioRequest
    {
        public int UserID { get; set; }
        public string Bio { get; set; }
    }
}
