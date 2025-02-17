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
        public async Task<IActionResult> SearchUser([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest(new { message = "Search keyword cannot be empty." });
            }

            try
            {
                var users = await _context.Users
                    .Where(u => u.Username.Contains(keyword) ||
                                u.FirstName.Contains(keyword) ||
                                u.LastName.Contains(keyword))
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
