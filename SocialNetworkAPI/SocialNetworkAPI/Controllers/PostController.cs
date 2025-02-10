using Microsoft.AspNetCore.Mvc;
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
        public IActionResult LikePost(int postId, [FromBody] int userId)
        {
            var like = new Like { PostID = postId, UserID = userId, DateTime = DateTime.UtcNow };
            _context.Likes.Add(like);
            _context.SaveChanges();
            return Ok("Post liked");
        }

        // Tương tác - Bình luận bài viết
        [HttpPost("comment/{postId}")]
        public IActionResult CommentOnPost(int postId, [FromBody] Comment comment)
        {
            comment.PostID = postId;
            comment.DateTime = DateTime.UtcNow;
            _context.Comments.Add(comment);
            _context.SaveChanges();
            return Ok(new { message = "Comment added", comment });
        }

        // Tương tác - Chia sẻ bài viết
        [HttpPost("share/{postId}")]
        public IActionResult SharePost(int postId, [FromBody] int userId)
        {
            var share = new Share { PostID = postId, UserShareID = userId };
            _context.Shares.Add(share);
            _context.SaveChanges();
            return Ok("Post shared successfully");
        }

        // Báo cáo bài viết
        [HttpPost("report/{postId}")]
        public IActionResult ReportPost(int postId, [FromBody] int userId)
        {
            var report = new ReportListUser { SenderID = userId, ReportedUserID = postId };
            _context.ReportListUsers.Add(report);
            _context.SaveChanges();
            return Ok("Post reported successfully");
        }
    }
}
