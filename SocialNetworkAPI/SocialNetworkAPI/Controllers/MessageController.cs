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
        public async Task<IActionResult> SendMessage([FromForm] MessageRequest request)
        {
            if (request == null || (string.IsNullOrEmpty(request.Content) && request.ImageFile == null))
            {
                return BadRequest(new { message = "Invalid message data. Either Content or ImageFile is required." });
            }

            // Logic xử lý tin nhắn
            var message = new SocialNetworkAPI.Models.Message
            {
                SenderID = request.SenderID,
                ReceiverID = request.ReceiverID,
                Content = request.Content,
                MediaType = request.Type,
                Timestamp = DateTime.Now
            };

            if (request.ImageFile != null)
            {
                var imageUrl = await SaveImage(request.ImageFile);
                message.ImageUrl = imageUrl;
                message.MediaType = "image";
            }

            try
            {
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                // Tạo thông báo và gửi real-time
                var notification = new Notification
                {
                    UserID = request.ReceiverID,
                    SenderID = request.SenderID,
                    Content = "You have a new message.",
                    DateTime = DateTime.Now,
                    Type = "message"
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                await _hubContext.Clients.User(request.ReceiverID.ToString())
                    .SendAsync("ReceiveMessage", new
                    {
                        SenderID = message.SenderID,
                        Content = message.Content,
                        ImageUrl = message.ImageUrl,
                        Timestamp = message.Timestamp
                    });

                return Ok(new { message = "Message sent successfully!", data = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while sending the message.", error = ex.Message });
            }
        }

        // Hàm lưu hình ảnh và trả về đường dẫn
        private async Task<string> SaveImage(IFormFile imageFile)
        {
            // Tạo tên file duy nhất
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

            // Đường dẫn lưu trữ hình ảnh
            var filePath = Path.Combine("wwwroot/images", fileName);

            // Lưu hình ảnh vào thư mục
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // Trả về đường dẫn truy cập hình ảnh
            return $"/images/{fileName}";
        }


        // Lấy lịch sử tin nhắn giữa hai người dùng
        [HttpPost("history")]
        public async Task<IActionResult> GetChatHistory([FromBody] ChatHistoryRequest request)
        {
            if (request == null || request.UserId <= 0 || request.FriendId <= 0)
            {
                return BadRequest(new { message = "Invalid request parameters." });
            }

            try
            {
                // Lấy tất cả tin nhắn giữa hai người dùng
                var messages = await _context.Messages
                    .Where(m => (m.SenderID == request.UserId && m.ReceiverID == request.FriendId) ||
                                (m.SenderID == request.FriendId && m.ReceiverID == request.UserId))
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new
                    {
                        m.MessageID,
                        m.SenderID,
                        m.ReceiverID,
                        Content = m.Content ?? "",
                        m.MediaType,
                        ImageUrl = string.IsNullOrEmpty(m.ImageUrl) ? null : $"{Request.Scheme}://{Request.Host}{m.ImageUrl}", // Trả về link hình ảnh đầy đủ
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

        // Lấy danh sách bạn bè của người dùng
        [HttpGet("friends/{userId}")]
        public async Task<IActionResult> GetFriends(int userId)
        {
            try
            {
                // Lấy danh sách bạn bè từ bảng Friendship
                var friends = await _context.Friendships
                    .Where(f => f.UserID1 == userId || f.UserID2 == userId)
                    .Select(f => new
                    {
                        FriendID = f.UserID1 == userId ? f.UserID2 : f.UserID1, // Lấy ID của bạn bè
                        FriendName = f.UserID1 == userId ? f.User2.Username : f.User1.Username, // Lấy tên của bạn bè
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                return Ok(friends);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving friends.", error = ex.Message });
            }
        }
    }

    // Model cho request gửi tin nhắn
    public class MessageRequest
    {
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public string? Content { get; set; }
        public string? Type { get; set; } // "text", "image", "video", "audio", "location"
        public IFormFile? ImageFile { get; set; }
    }

    // Model cho tin nhắn trong database
    public class Message
    {
        public int Id { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public string? Content { get; set; }
        public string Type { get; set; }
        public DateTime Timestamp { get; set; }
    }
    public class ChatHistoryRequest
    {
        public int UserId { get; set; }
        public int FriendId { get; set; }
    }

}