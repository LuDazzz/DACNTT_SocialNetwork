using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Hubs;
using SocialNetworkAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Gửi thông báo action (like, comment)
        [HttpPost("sendActionNoti")]
        public async Task<IActionResult> SendActionNotification([FromBody] ActionNotificationDto actionNoti)
        {
            if (actionNoti == null || actionNoti.PostOwnerId == actionNoti.UserId)
            {
                return BadRequest(new { message = "Invalid notification request." });
            }

            var notification = new Notification
            {
                UserID = actionNoti.PostOwnerId, // Người nhận thông báo
                Content = $"{actionNoti.Username} has interacted with your post.",
                DateTime = DateTime.UtcNow,
                IsRead = false,
                Type = "action" // Đánh dấu loại thông báo
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 📢 Gửi thông báo thời gian thực qua SignalR
            await _hubContext.Clients.User(actionNoti.PostOwnerId.ToString())
                .SendAsync("ReceiveNotification", notification);

            return Ok(new { message = "Action notification sent successfully!" });
        }

        // 📌 2️⃣ Gửi thông báo bạn bè (friend request, accept friend)
        [HttpPost("sendFriendNoti")]
        public async Task<IActionResult> SendFriendNotification([FromBody] FriendNotificationDto friendNoti)
        {
            if (friendNoti == null)
            {
                return BadRequest(new { message = "Invalid friend notification request." });
            }

            var notification = new Notification
            {
                UserID = friendNoti.ReceiverId, // Người nhận thông báo
                Content = $"{friendNoti.Username} {friendNoti.Message}",
                DateTime = DateTime.UtcNow,
                IsRead = false,
                Type = "friend"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 📢 Gửi thông báo thời gian thực qua SignalR
            await _hubContext.Clients.User(friendNoti.ReceiverId.ToString())
                .SendAsync("ReceiveNotification", notification);

            return Ok(new { message = "Friend notification sent successfully!" });
        }

        // 📌 3️⃣ Lấy danh sách thông báo theo UserID và loại noti
        [HttpGet("{userId}/{type}")]
        public async Task<IActionResult> GetNotifications(int userId, string type)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserID == userId && n.Type == type)
                .OrderByDescending(n => n.DateTime)
                .ToListAsync();

            return Ok(notifications);
        }

        // 📌 4️⃣ Đánh dấu thông báo đã đọc
        [HttpPut("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification marked as read." });
        }

        // 📌 5️⃣ Xóa thông báo
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification deleted successfully." });
        }
    }

    // DTO cho Action Notification
    public class ActionNotificationDto
    {
        public int PostOwnerId { get; set; } // Người sở hữu bài viết
        public int UserId { get; set; } // Người thực hiện hành động
        public string Username { get; set; } // Tên người tương tác
    }

    // DTO cho Friend Notification
    public class FriendNotificationDto
    {
        public int ReceiverId { get; set; } // Người nhận thông báo
        public string Username { get; set; } // Người gửi thông báo
        public string Message { get; set; } // Nội dung thông báo (ex: "has sent you a friend request")
    }
}
