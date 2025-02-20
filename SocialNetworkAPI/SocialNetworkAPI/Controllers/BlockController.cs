using Microsoft.AspNetCore.Mvc;
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/block")]
    [ApiController]
    public class BlockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlockController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Chặn người dùng
        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] Block block)
        {
            if (block.UserID1 == block.UserID2)
                return BadRequest("You cant block yourself");

            var existingBlock = _context.Blocks.FirstOrDefault(b =>
                b.UserID1 == block.UserID1 && b.UserID2 == block.UserID2);

            if (existingBlock != null)
                return BadRequest("This user has been blocked before");

            _context.Blocks.Add(block);
            await _context.SaveChangesAsync();

            return Ok("User is blocked");
        }

        // Bỏ chặn người dùng
        [HttpDelete("unblock/{userId1}/{userId2}")]
        public async Task<IActionResult> UnblockUser(int userId1, int userId2)
        {
            var block = _context.Blocks.FirstOrDefault(b =>
                b.UserID1 == userId1 && b.UserID2 == userId2);

            if (block == null)
                return NotFound("Cannot find block data");

            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();

            return Ok("User's block is removed.");
        }

        [HttpPost("hasBlocked")]
        public async Task<IActionResult> HasBlocked([FromBody] BlockRequest request)
        {
            if (request.UserID1 == request.UserID2)
                return BadRequest("You can't check blocking status for the same user.");

            bool isBlocked = await _context.Blocks.AnyAsync(b =>
                b.UserID1 == request.UserID1 && b.UserID2 == request.UserID2);

            return Ok(new { hasBlocked = isBlocked });
        }

        // DTO để nhận dữ liệu từ body JSON
        public class BlockRequest
        {
            public int UserID1 { get; set; }
            public int UserID2 { get; set; }
        }

        [HttpPost("checkBlockAndUnfriend")]
        public async Task<IActionResult> CheckBlockAndUnfriend([FromBody] BlockRequest request)
        {
            if (request.UserID1 == request.UserID2)
                return BadRequest("Invalid request: A user cannot block themselves.");

            // Kiểm tra xem có ai bị block không
            bool isBlocked = await _context.Blocks.AnyAsync(b =>
                (b.UserID1 == request.UserID1 && b.UserID2 == request.UserID2) ||
                (b.UserID1 == request.UserID2 && b.UserID2 == request.UserID1));

            if (isBlocked)
            {
                // Nếu bị block, xóa quan hệ bạn bè
                var friendship = await _context.Friendships.FirstOrDefaultAsync(f =>
                    (f.UserID1 == request.UserID1 && f.UserID2 == request.UserID2) ||
                    (f.UserID1 == request.UserID2 && f.UserID2 == request.UserID1));

                if (friendship != null)
                {
                    _context.Friendships.Remove(friendship);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "User is blocked, friendship removed.", isBlocked = true });
            }

            return Ok(new { message = "No blocking detected, friendship remains.", isBlocked = false });
        }

    }
}
