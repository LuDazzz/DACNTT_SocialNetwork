using Microsoft.AspNetCore.Mvc;
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("isFriend")]
        public async Task<IActionResult> IsFriend([FromBody] FriendshipRequest request)
        {
            if (request.UserID1 == request.UserID2)
                return BadRequest("You can't check friendship status for the same user.");

            bool isFriend = await _context.Friendships.AnyAsync(f =>
                (f.UserID1 == request.UserID1 && f.UserID2 == request.UserID2) ||
                (f.UserID1 == request.UserID2 && f.UserID2 == request.UserID1)); // Kiểm tra cả hai chiều kết bạn

            return Ok(new { isFriend = isFriend });
        }

        [HttpGet("count/{userId}")]
        public async Task<IActionResult> GetFriendsCount(int userId)
        {
            var count = await _context.Friendships
                .Where(f => f.UserID1 == userId || f.UserID2 == userId)
                .CountAsync();

            await UpdateFriendsCounter(userId);

            return Ok(new { UserId = userId, FriendsCount = count });
        }


        // DTO để nhận dữ liệu từ body JSON
        public class FriendshipRequest
        {
            public int UserID1 { get; set; }
            public int UserID2 { get; set; }
        }

        private async Task UpdateFriendsCounter(int userId)
        {
            var count = await _context.Friendships
                .Where(f => f.UserID1 == userId || f.UserID2 == userId)
                .CountAsync();

            await _context.Users
                .Where(u => u.UserID == userId)
                .ExecuteUpdateAsync(u => u.SetProperty(x => x.FriendsCount, count));
        }


        [HttpDelete("unfriend")]
        public async Task<IActionResult> Unfriend(int userId1, int userId2)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f =>
                    (f.UserID1 == userId1 && f.UserID2 == userId2) ||
                    (f.UserID1 == userId2 && f.UserID2 == userId1));

            if (friendship == null)
                return NotFound("Friendship not found.");

            _context.Friendships.Remove(friendship);
            await _context.SaveChangesAsync();

            await UpdateFriendsCounter(userId1);
            await UpdateFriendsCounter(userId2);

            return Ok("Friendship removed.");
        }
      


    }

}
