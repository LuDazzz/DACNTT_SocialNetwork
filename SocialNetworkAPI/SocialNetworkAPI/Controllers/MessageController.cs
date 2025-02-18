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
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<MessageHub> _hubContext;

        public MessageController(ApplicationDbContext context, IHubContext<MessageHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Gửi tin nhắn
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] MessageRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Content))
            {
                return BadRequest(new { message = "Invalid message data." });
            }

            // Tạo tin nhắn mới
            var message = new SocialNetworkAPI.Models.Message
            {
                SenderID = request.SenderID,
                ReceiverID = request.ReceiverID,
                Content = request.Content,
                MediaType = request.Type,
                Timestamp = DateTime.UtcNow
            };

            try
            {
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                // **Tạo thông báo cho người nhận**
                var notification = new Notification
                {
                    UserID = request.ReceiverID,  // Người nhận tin nhắn
                    SenderID = request.SenderID,  // Người gửi tin nhắn
                    Content = "You have a new message.",
                    DateTime = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync(); // Lưu thông báo vào DB

                // **Gửi thông báo real-time qua SignalR**
                await _hubContext.Clients.User(request.ReceiverID.ToString())
                    .SendAsync("ReceiveMessage", new
                    {
                        SenderID = message.SenderID,
                        Content = message.Content,
                        Timestamp = message.Timestamp
                    });

                // Gửi sự kiện thông báo mới cho frontend
                await _hubContext.Clients.User(request.ReceiverID.ToString())
                    .SendAsync("ReceiveNotification", new
                    {
                        Message = "You have a new message.",
                        SenderID = request.SenderID
                    });

                return Ok(new { message = "Message sent successfully!", data = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while sending the message.", error = ex.Message });
            }
        }


        // Lấy lịch sử tin nhắn giữa hai người dùng
        [HttpGet("history/{userId}/{friendId}")]
        public async Task<IActionResult> GetChatHistory(int userId, int friendId)
        {
            try
            {
                // Lấy tất cả tin nhắn giữa hai người dùng
                var messages = await _context.Messages
                    .Where(m => (m.SenderID == userId && m.ReceiverID == friendId) ||
                                (m.SenderID == friendId && m.ReceiverID == userId))
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new
                    {
                        m.MessageID,
                        m.SenderID,
                        m.ReceiverID,
                        m.Content,
                        m.MediaType,
                        m.Timestamp
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving chat history.", error = ex.Message });
            }
        }

        // Xóa tin nhắn
        [HttpDelete("delete/{messageId}")]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            try
            {
                // Tìm tin nhắn cần xóa
                var message = await _context.Messages.FindAsync(messageId);
                if (message == null)
                {
                    return NotFound(new { message = "Message not found." });
                }

                // Xóa tin nhắn
                _context.Messages.Remove(message);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Message deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the message.", error = ex.Message });
            }
        }
    }

    // Model cho request gửi tin nhắn
    public class MessageRequest
    {
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public string Content { get; set; }
        public string Type { get; set; } // "text", "image", "video", "audio", "location"
    }

    // Model cho tin nhắn trong database
    public class Message
    {
        public int Id { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public string Content { get; set; }
        public string Type { get; set; }
        public DateTime Timestamp { get; set; }
    }
}