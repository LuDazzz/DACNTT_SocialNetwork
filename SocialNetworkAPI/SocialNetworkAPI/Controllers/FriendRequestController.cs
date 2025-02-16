using Microsoft.AspNetCore.Mvc;
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/friends")]
    [ApiController]
    public class FriendRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FriendRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Gửi lời mời kết bạn
        [HttpPost("send")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequest request)
        {
            if (request.SenderID == request.ReceiverID)
                return BadRequest("You cant send friend request to yourself.");

            var existingRequest = _context.FriendRequests.FirstOrDefault(fr =>
                (fr.SenderID == request.SenderID && fr.ReceiverID == request.ReceiverID) ||
                (fr.SenderID == request.ReceiverID && fr.ReceiverID == request.SenderID));

            if (existingRequest != null)
                return BadRequest("The request is already existed.");

            _context.FriendRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok("Friend request is sent successfully.");
        }

        // Chấp nhận lời mời kết bạn
        [HttpPost("accept/{requestId}")]
        public async Task<IActionResult> AcceptFriendRequest(int requestId)
        {
            var request = await _context.FriendRequests
                .Include(fr => fr.Sender)
                .Include(fr => fr.Receiver)
                .FirstOrDefaultAsync(fr => fr.RequestID == requestId);

            if (request == null)
            {
                return NotFound(new { message = "Friend request not found" });
            }

            // Kiểm tra Sender và Receiver có tồn tại không
            if (request.Sender == null || request.Receiver == null)
            {
                return BadRequest(new { message = "Invalid friend request data" });
            }

            // Tạo mới Friendship
            var friendship = new Friendship
            {
                UserID1 = request.SenderID, // Không để NULL
                UserID2 = request.ReceiverID, // Không để NULL
                CreatedAt = DateTime.Now
            };

            _context.Friendships.Add(friendship);
            _context.FriendRequests.Remove(request);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Friend request accepted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving data", error = ex.Message });
            }
        }
        [HttpDelete("cancel/{requestId}")]
        public async Task<IActionResult> CancelFriendRequest(int requestId)
        {
            var request = await _context.FriendRequests.FindAsync(requestId);

            if (request == null)
            {
                return NotFound(new { message = "Friend request not found" });
            }

            _context.FriendRequests.Remove(request);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Friend request canceled" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting data", error = ex.Message });
            }
        }


    }
}
