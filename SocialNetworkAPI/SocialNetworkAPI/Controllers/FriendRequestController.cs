using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;  // Thêm SignalR
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Hubs;  // Import NotificationHub
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
        private readonly IHubContext<NotificationHub> _hubContext; // SignalR Hub

        public FriendRequestController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
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
            await _context.SaveChangesAsync();

            var sender = await _context.Users.FindAsync(request.SenderID);
            var receiver = await _context.Users.FindAsync(request.ReceiverID);
            if (sender == null || receiver == null)
                return BadRequest("Sender or Receiver not found.");

            var notification = new Notification
            {
                UserID = request.ReceiverID,
                SenderID = request.SenderID,
                Content = $"{sender.Username} sent you a friend request.",
                DateTime = DateTime.Now,
                Type = "FriendRequest"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 📢 Gửi thông báo real-time cho người nhận
            await _hubContext.Clients.User(request.ReceiverID.ToString())
                .SendAsync("ReceiveNotification", notification);

            return Ok("Friend request sent successfully.");
        }

        // Chấp nhận lời mời kết bạn
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFriendRequest([FromBody] AcceptFriendRequestDto request)
        {
            var friendRequest = await _context.FriendRequests
                .FirstOrDefaultAsync(fr => fr.SenderID == request.SenderID && fr.ReceiverID == request.ReceiverID);

            if (friendRequest == null)
                return NotFound(new { message = "Friend request not found" });

            // Tạo bản ghi mới trong bảng Friendships
            var friendship = new Friendship
            {
                UserID1 = request.SenderID,
                UserID2 = request.ReceiverID,
                CreatedAt = DateTime.Now
            };

            _context.Friendships.Add(friendship);
            _context.FriendRequests.Remove(friendRequest); // Xóa lời mời kết bạn

            // Thêm thông báo cho người gửi lời mời
            var notification = new Notification
            {
                UserID = request.SenderID,
                SenderID = request.ReceiverID,
                Content = $"User {request.ReceiverID} accepted your friend request.",
                DateTime = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 📢 Gửi thông báo real-time cho người gửi lời mời
            await _hubContext.Clients.User(request.SenderID.ToString())
                .SendAsync("ReceiveNotification", notification);

            return Ok(new { message = "Friend request accepted successfully." });
        }
        public class AcceptFriendRequestDto
        {
            public int SenderID { get; set; }
            public int ReceiverID { get; set; }
        }

        // Kiểm tra trạng thái kết bạn của hai người
        [HttpGet("status")]
        public async Task<IActionResult> GetFriendRequestStatus(int loggerID, int userID)
        {
            // Kiểm tra xem có lời mời kết bạn nào giữa hai người dùng không
            var friendRequest = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    (fr.SenderID == loggerID && fr.ReceiverID == userID) ||
                    (fr.SenderID == userID && fr.ReceiverID == loggerID));

            if (friendRequest == null)
            {
                // Nếu không có lời mời kết bạn nào, trả về "noRequest"
                return Ok(new { status = "noRequest" });
            }

            // Nếu loggerID là người gửi lời mời, trả về "sendRequest"
            if (friendRequest.SenderID == loggerID)
            {
                return Ok(new { status = "sendRequest" });
            }

            // Nếu loggerID là người nhận lời mời, trả về "isRequest"
            if (friendRequest.ReceiverID == loggerID)
            {
                return Ok(new { status = "isRequested" });
            }

            // Trường hợp không xác định, trả về lỗi
            return BadRequest(new { message = "Unknown error occurred." });
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> CancelFriendRequest([FromBody] CancelFriendRequestDto request)
        {
            var friendRequest = await _context.FriendRequests
                .FirstOrDefaultAsync(fr => fr.SenderID == request.SenderID && fr.ReceiverID == request.ReceiverID);

            if (friendRequest == null)
                return NotFound(new { message = "Friend request not found" });

            _context.FriendRequests.Remove(friendRequest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request canceled successfully." });
        }

        public class CancelFriendRequestDto
        {
            public int SenderID { get; set; }
            public int ReceiverID { get; set; }
        }

    }
}
