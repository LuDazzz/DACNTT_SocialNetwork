using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

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

        [HttpPost("updateProfilePictures")]
        public async Task<IActionResult> UpdateProfilePictures([FromBody] UpdateProfilePicturesRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserID);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (request.Avatar != null && request.Avatar.Length > 0)
            {
                user.ProfilePicture = request.Avatar;
            }

            if (request.CoverPhoto != null && request.CoverPhoto.Length > 0)
            {
                user.CoverPhoto = request.CoverPhoto;
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Profile pictures updated successfully" });
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
