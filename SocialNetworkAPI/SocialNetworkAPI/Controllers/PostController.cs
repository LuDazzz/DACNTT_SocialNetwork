using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _context.Posts
                .Where(p => p.PostID == id)
                .Select(p => new
                {
                    p.PostID,
                    p.UserID,
                    p.Content,
                    p.MediaType,
                    p.MediaURL,
                    p.DateTime,
                    p.IsUpdated,
                    p.DateTimeUpdated,
                    User = new
                    {
                        p.User.UserID,
                        p.User.Username,
                        p.User.ProfilePicture
                    }
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPosts(
            [FromQuery] string? keyword,
            [FromQuery] int? userId,
            [FromQuery] string? mediaType,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var query = _context.Posts.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.Content.Contains(keyword));
            }

            if (userId.HasValue)
            {
                query = query.Where(p => p.UserID == userId.Value);
            }

            if (!string.IsNullOrEmpty(mediaType))
            {
                query = query.Where(p => p.MediaType == mediaType);
            }

            if (startDate.HasValue)
            {
                query = query.Where(p => p.DateTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(p => p.DateTime <= endDate.Value);
            }

            var results = await query
                .OrderByDescending(p => p.DateTime) // Sắp xếp theo ngày đăng
                .ToListAsync();

            return Ok(results);
        }


        // Đăng bài viết
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] Post post)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(post.UserID);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            post.User = user;  // Gán user để tránh lỗi khi lưu vào DB
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { id = post.PostID }, post);
        }


        // Chỉnh sửa bài viết
        [HttpPut("edit/{postId}")]
        public IActionResult EditPost(int postId, [FromBody] Post updatedPost)
        {
            var post = _context.Posts.Find(postId);
            if (post == null) return NotFound("Post not found");

            post.Content = updatedPost.Content;
            post.MediaType = updatedPost.MediaType;
            post.MediaURL = updatedPost.MediaURL;
            post.IsUpdated = true;
            post.DateTimeUpdated = DateTime.Now;

            _context.SaveChanges();

            return Ok(new { message = "Post updated successfully", post });
        }

        // Xóa bài viết
        [HttpDelete("delete/{postId}")]
        public IActionResult DeletePost(int postId)
        {
            var likes = _context.Likes.Where(l => l.PostID == postId);
            _context.Likes.RemoveRange(likes);
            var post = _context.Posts.Find(postId);
            if (post == null) return NotFound("Post not found");

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return Ok("Post deleted successfully");
        }

        // Tương tác - Like bài viết
        [HttpPost("like/{postId}")]
        public async Task<IActionResult> LikePost(int postId, [FromBody] LikeRequest request)
        {
            if (request == null || request.UserID <= 0) return BadRequest("Invalid input data.");

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Tìm bài viết
                    var post = await _context.Posts.FindAsync(postId);
                    if (post == null) return NotFound("Post not found.");

                    // Kiểm tra xem người dùng đã like bài viết chưa
                    var existingLike = await _context.Likes
                        .FirstOrDefaultAsync(l => l.PostID == postId && l.UserID == request.UserID);

                    if (existingLike != null)
                    {
                        // Nếu đã like, thì xóa like (Unlike)
                        _context.Likes.Remove(existingLike);
                    }
                    else
                    {
                        // Nếu chưa like, thì thêm like
                        var newLike = new Like { PostID = postId, UserID = request.UserID };
                        _context.Likes.Add(newLike);

                        var notification = new Notification
                        {
                            UserID = post.UserID,  // Người nhận thông báo (chủ bài viết)
                            SenderID = request.UserID,  // Người gửi thông báo (người like)
                            Content = $"User {request.UserID} liked your post!",
                            DateTime = DateTime.Now
                        };

                        _context.Notifications.Add(notification);
                    }


                    

                    // Lưu thay đổi vào database
                    await _context.SaveChangesAsync();

                    // Cập nhật lại số lượng likes chính xác
                    post.LikeCounter = await _context.Likes.CountAsync(l => l.PostID == postId);
                    await _context.SaveChangesAsync();

                    // Commit transaction
                    await transaction.CommitAsync();

                    // Trả về kết quả
                    return Ok(new { message = existingLike != null ? "Unliked post" : "Liked post", likeCount = post.LikeCounter });
                }
                catch (Exception ex)
                {
                    // Rollback transaction nếu có lỗi
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Internal server error");
                }
            }
        }

        public class LikeRequest
        {
            public int UserID { get; set; }
        }

        // Kiểm tra đã like bài viết chưa
        [HttpPost("HasLiked")]
        public async Task<IActionResult> HasLiked([FromBody] LikeCheckRequest request)
        {
            if (request == null || request.PostID <= 0 || request.UserID <= 0)
                return BadRequest(new { message = "Invalid input data." });

            var hasLiked = await _context.Likes.AnyAsync(l => l.PostID == request.PostID && l.UserID == request.UserID);
            return Ok(new { liked = hasLiked });
        }

        public class LikeCheckRequest
        {
            public int PostID { get; set; }
            public int UserID { get; set; }
        }



        // Tương tác - Bình luận bài viết
        [HttpPost("comment/{postId}")]
        public async Task<IActionResult> CommentOnPost(int postId, [FromBody] Comment comment)
        {
            if (comment == null || string.IsNullOrWhiteSpace(comment.Content))
                return BadRequest("Invalid comment data");

            var user = await _context.Users.FindAsync(comment.UserID);
            if (user == null)
                return Unauthorized("You need to log in to comment.");

            var post = await _context.Posts.FindAsync(postId);
            if (post == null) return NotFound("Post not found");

            // Gán PostID trước khi thêm comment
            comment.PostID = postId;
            comment.DateTime = DateTime.Now;

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();  // Lưu comment trước để có ID

            // Cập nhật CommentCounter sau khi thêm comment
            post.CommentCounter = await _context.Comments.CountAsync(c => c.PostID == postId);
            var notification = new Notification
            {
                UserID = post.UserID,  // Người nhận thông báo (chủ bài viết)
                SenderID = comment.UserID,  // Người gửi thông báo (người bình luận)
                Content = $"User {user.Username} commented on your post: {comment.Content}",  // Nội dung thông báo
                DateTime = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment added", comment, commentCount = post.CommentCounter });
        }

        [HttpGet("getCommentListByPostID/{postId}")]
        public async Task<IActionResult> GetCommentListByPostID(int postId)
        {
            var comments = await _context.Comments
                .Where(c => c.PostID == postId)
                .OrderBy(c => c.DateTime) // Sắp xếp theo thời gian
                .ToListAsync();

            if (comments == null || comments.Count == 0)
            {
                return NotFound(new { message = "No comments found for this post." });
            }

            return Ok(comments);
        }



        // Tương tác - Chia sẻ bài viết
        [HttpPost("share/{postId}")]
        public async Task<IActionResult> SharePost(int postId, [FromBody] int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized("You need to log in to share a post.");

            var post = await _context.Posts.FindAsync(postId);
            if (post == null) return NotFound("Post not found");

            var share = new Share { PostID = postId, UserShareID = userId };
            _context.Shares.Add(share);
            await _context.SaveChangesAsync(); // Lưu share trước

            // Cập nhật ShareCounter
            post.ShareCounter = await _context.Shares.CountAsync(s => s.PostID == postId);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post shared successfully", shareCount = post.ShareCounter });
        }

        [HttpGet("getShareByPostID/{postID}")]
        public async Task<IActionResult> GetShareByPostID(int postID)
        {
            try
            {
                var post = await _context.Posts
                    .Where(p => p.PostID == postID)
                    .Select(p => new
                    {
                        p.PostID,
                        p.ShareCounter
                    })
                    .FirstOrDefaultAsync();

                if (post == null)
                {
                    return NotFound(new { message = "Post not found." });
                }

                var shares = await _context.Shares
                    .Where(s => s.PostID == postID)
                    .OrderByDescending(s => s.DateTime)
                    .ToListAsync(); // Chuyển dữ liệu về client trước khi xử lý tiếp

                var userIDs = shares.Select(s => s.UserShareID).Distinct().ToList();
                var users = await _context.Users
                    .Where(u => userIDs.Contains(u.UserID))
                    .ToDictionaryAsync(u => u.UserID, u => u.Username);

                var shareResults = shares.Select(s => new
                {
                    s.ShareID,
                    UserShare = users.ContainsKey(s.UserShareID) ? users[s.UserShareID] : "Unknown",
                    s.DateTime
                }).ToList();

                return Ok(new
                {
                    post.PostID,
                    post.ShareCounter,
                    Shares = shareResults
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving shares.", error = ex.Message });
            }
        }




        // Báo cáo bài viết
        [HttpPost("report/{postId}")]
        public async Task<IActionResult> ReportPost(int postId, [FromBody] ReportPost report)
        {
            // Kiểm tra xem bài viết có tồn tại không
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }

            // Kiểm tra xem user có tồn tại không (tạm thời dùng UserID từ body)
            var user = await _context.Users.FindAsync(report.ReporterID);
            if (user == null)
            {
                return Unauthorized("User not found. Please log in.");
            }

            // Tạo báo cáo mới
            var newReport = new ReportPost
            {
                ReporterID = report.ReporterID, // Sẽ thay bằng UserID từ JWT nếu có
                PostID = postId,
                Reason = report.Reason
            };

            _context.ReportPosts.Add(newReport);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post reported successfully.", report = newReport });
        }

        [HttpGet("getAllPosts/{currentUserId}")]
        public async Task<IActionResult> GetAllPosts(int currentUserId)
        {
            try
            {
                // Lấy danh sách bạn bè của currentUserId
                var friendIds = await _context.Friendships
                    .Where(f => f.UserID1 == currentUserId || f.UserID2 == currentUserId)
                    .Select(f => f.UserID1 == currentUserId ? f.UserID2 : f.UserID1)
                    .ToListAsync();

                var posts = await _context.Posts
                    .Include(p => p.User) // Include để lấy thông tin User
                    .Where(p =>
                        p.UserID != currentUserId && // Không lấy bài viết của chính mình
                        (!p.User.IsPrivate || friendIds.Contains(p.UserID))) // Lấy user công khai hoặc là bạn bè
                    .OrderByDescending(p => p.DateTime) // Sắp xếp bài viết mới nhất lên đầu
                    .Select(p => new
                    {
                        p.PostID,
                        p.Content,
                        p.MediaType,
                        p.MediaURL,
                        p.DateTime,
                        p.IsUpdated,
                        p.DateTimeUpdated,
                        p.ShareCounter,
                        p.LikeCounter,
                        p.CommentCounter,
                        User = new
                        {
                            p.User.UserID,
                            p.User.Username,
                            p.User.FirstName,
                            p.User.LastName,
                            p.User.ProfilePicture
                        }
                    })
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving posts.", error = ex.Message });
            }
        }



    }
}
