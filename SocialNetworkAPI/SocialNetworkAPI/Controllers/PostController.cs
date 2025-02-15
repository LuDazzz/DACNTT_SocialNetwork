using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
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
            post.DateTimeUpdated = DateTime.UtcNow;

            _context.SaveChanges();

            return Ok(new { message = "Post updated successfully", post });
        }

        // Xóa bài viết
        [HttpDelete("delete/{postId}")]
        public IActionResult DeletePost(int postId)
        {
            var post = _context.Posts.Find(postId);
            if (post == null) return NotFound("Post not found");

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return Ok("Post deleted successfully");
        }

        // Tương tác - Like bài viết
        [HttpPost("like/{postId}")]
        public async Task<IActionResult> LikePost(int postId, [FromBody] int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized("You need to log in to like a post.");

            var post = _context.Posts.Find(postId);
            if (post == null) return NotFound("Post not found");

            post.LikeCounter++; // Tăng bộ đếm
            _context.SaveChanges();

            return Ok(new { message = "Post liked", likeCount = post.LikeCounter });
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
            comment.DateTime = DateTime.UtcNow;

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();  // Lưu comment trước để có ID

            // Cập nhật CommentCounter sau khi thêm comment
            post.CommentCounter = await _context.Comments.CountAsync(c => c.PostID == postId);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment added", comment, commentCount = post.CommentCounter });
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


    }
}
