using Microsoft.AspNetCore.Mvc;
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/friends")]
    [ApiController]
    public class FriendshipController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FriendshipController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hủy kết bạn
        [HttpDelete("remove/{userId1}/{userId2}")]
        public async Task<IActionResult> RemoveFriend(int userId1, int userId2)
        {
            var friendship = _context.Friendships.FirstOrDefault(f =>
                (f.UserID1 == userId1 && f.UserID2 == userId2) ||
                (f.UserID1 == userId2 && f.UserID2 == userId1));

            if (friendship == null)
                return NotFound("Cannot find.");

            _context.Friendships.Remove(friendship);
            await _context.SaveChangesAsync();

            return Ok("Unfriend successfully.");
        }
    }
}
