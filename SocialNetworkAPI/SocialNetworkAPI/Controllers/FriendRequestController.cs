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
                return BadRequest("You can't send a friend request to yourself.");

            var existingRequest = await _context.FriendRequests.FirstOrDefaultAsync(fr =>
                (fr.SenderID == request.SenderID && fr.ReceiverID == request.ReceiverID) ||
                (fr.SenderID == request.ReceiverID && fr.ReceiverID == request.SenderID));

            if (existingRequest != null)
                return BadRequest("The request already exists.");

            _context.FriendRequests.Add(request);
            await _context.SaveChangesAsync();  // Lưu lời mời kết bạn trước

            // Kiểm tra lại user có tồn tại không trước khi tạo thông báo
            var receiver = await _context.Users.FindAsync(request.ReceiverID);
            var sender = await _context.Users.FindAsync(request.SenderID);
            if (receiver == null || sender == null)
                return BadRequest("Sender or Receiver not found.");

            // Tạo notification cho người nhận lời mời kết bạn
            var notification = new Notification
            {
                UserID = request.ReceiverID,  // Người nhận lời mời
                SenderID = request.SenderID,  // Người gửi lời mời
                Content = $"{sender.Username} sent you a friend request.", // Hiển thị username
                DateTime = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();  // Lưu thông báo vào DB

            return Ok("Friend request sent successfully.");
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

            var notification = new Notification
            {
                UserID = request.SenderID,  // Người gửi lời mời nhận thông báo
                SenderID = request.ReceiverID,  // Người chấp nhận lời mời
                Content = $"User {request.ReceiverID} accepted your friend request.",
                DateTime = DateTime.Now
            };

            _context.Notifications.Add(notification);

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
