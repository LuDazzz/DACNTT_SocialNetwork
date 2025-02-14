using Microsoft.AspNetCore.Mvc;
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using System.Linq;
using System.Threading.Tasks;
using System;

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
    }
}
