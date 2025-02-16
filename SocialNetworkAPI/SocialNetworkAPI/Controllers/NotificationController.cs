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

        // 1️⃣ Gửi thông báo
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] Notification notification)
        {
            if (notification == null || string.IsNullOrEmpty(notification.Content))
            {
                return BadRequest(new { message = "Invalid notification." });
            }

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 📢 Gửi thông báo thời gian thực qua SignalR
            await _hubContext.Clients.User(notification.UserID.ToString())
                .SendAsync("ReceiveNotification", notification);

            return Ok(new { message = "Notification sent successfully!" });
        }

        // 2️⃣ Lấy danh sách thông báo theo UserID
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserID == userId)
                .OrderByDescending(n => n.DateTime)
                .ToListAsync();

            return Ok(notifications);
        }

        // 3️⃣ Đánh dấu thông báo đã đọc
        [HttpPut("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification marked as read." });
        }

        // 4️⃣ Xóa thông báo
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
}
