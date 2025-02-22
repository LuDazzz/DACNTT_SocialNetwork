using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAPI.Data;
using SocialNetworkAPI.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using static SocialNetworkAPI.Models.User;

[Route("api/admin")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 🔹 Get danh sách người dùng
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Where(u => u.IsAdmin == false)
            .Select(u => new { u.UserID, u.Username, u.Email, u.IsAdmin })
            .ToListAsync();
        return Ok(users);

    }

    // 🔹 Xóa người dùng
    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var friendships = _context.Friendships
        .Where(f => f.UserID1 == userId || f.UserID2 == userId);
        _context.Friendships.RemoveRange(friendships);

        var friendRequests = _context.FriendRequests
            .Where(fr => fr.SenderID == userId || fr.ReceiverID == userId);
        _context.FriendRequests.RemoveRange(friendRequests);

        var likes = _context.Likes
            .Where(l => l.UserID == userId);
        _context.Likes.RemoveRange(likes);

        var comments = _context.Comments
                .Where(l => l.UserID == userId);
        _context.Likes.RemoveRange(likes);

        var shares = _context.Shares
            .Where(s => s.UserShareID == userId);
        _context.Shares.RemoveRange(shares);

        // Sau đó xóa người dùng
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User deleted successfully." });
    }

    // 🔹 Get tất cả bài viết
    [HttpGet("posts")]
    public async Task<IActionResult> GetAllPosts()
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .Select(p => new { p.PostID, p.User.Username, p.Content, p.DateTime })
            .ToListAsync();
        return Ok(posts);
    }



    // 🔹 Xóa bài viết
    [HttpDelete("posts/{postId}")]
    public async Task<IActionResult> DeletePost(int postId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
        {
            return NotFound("Post not found.");
        }

        // Xóa tất cả các bản ghi liên quan trong các bảng
        var likes = _context.Likes
            .Where(l => l.PostID == postId);
        _context.Likes.RemoveRange(likes);

        var comments = _context.Comments
            .Where(c => c.PostID == postId);
        _context.Comments.RemoveRange(comments);

        var shares = _context.Shares
            .Where(s => s.PostID == postId);
        _context.Shares.RemoveRange(shares);


        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Post deleted successfully." });
    }

    // 🔹 Get danh sách báo cáo
    [HttpGet("reports/posts")]
    public async Task<IActionResult> GetReportedPosts()
    {
        var reportedPosts = await _context.ReportPosts
            .Join(_context.Posts, r => r.PostID, p => p.PostID, (r, p) => new
            {
                r.ReportID,
                PostContent = p.Content, // Nội dung bài viết bị báo cáo
                PostDateTime = p.DateTime, // Thời gian bài viết bị báo cáo
                p.UserID, // UserID của người đăng bài
                r.Reason, // Lý do báo cáo
                ReporterID = r.ReporterID,
                ReportedTime = r.ReportTime
            })
            .Join(_context.Users, r => r.ReporterID, u => u.UserID, (r, u) => new
            {
                r.ReportID,
                r.PostContent,
                r.PostDateTime,
                r.UserID, // UserID của người đăng bài
                r.Reason,
                Reporter = u.Username, // Tên người báo cáo
                r.ReportedTime
            })
            .Join(_context.Users, r => r.UserID, u => u.UserID, (r, u) => new
            {
                r.ReportID,
                r.PostContent,
                r.PostDateTime,
                r.Reason,
                r.Reporter, // Tên người báo cáo
                PostAuthor = u.Username, // Tên người đăng bài
                r.ReportedTime
            })
            .ToListAsync();

        return Ok(reportedPosts);
    }

    [HttpGet("reports/users")]
    public async Task<IActionResult> GetReportedUsers()
    {
        var reportedUsers = await _context.ReportListUsers
            .Join(_context.Users, r => r.SenderID, u => u.UserID, (r, sender) => new
            {
                r.ReportID,
                ReporterID = sender.UserID,          // ID người báo cáo
                ReporterUsername = sender.Username,  // Tên người báo cáo
                r.UserIsReported,
                r.Reason,
                r.CreatedAt
            })
            .Join(_context.Users, r => r.UserIsReported, u => u.UserID, (r, reportedUser) => new
            {
                r.ReportID,
                r.ReporterID,
                r.ReporterUsername,
                ReportedUserID = reportedUser.UserID,         // ID người bị báo cáo
                ReportedUsername = reportedUser.Username,     // Tên người bị báo cáo
                r.Reason,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reportedUsers);
    }




    // 🔹 Xóa báo cáo sau khi xử lý
    [HttpDelete("reports/posts/{reportId}")]
    public async Task<IActionResult> DeleteReport(int reportId)
    {
        // Tìm báo cáo cần xóa
        var report = await _context.ReportPosts.FindAsync(reportId);
        if (report == null)
        {
            return NotFound("Report not found.");
        }

        // Xóa báo cáo
        _context.ReportPosts.Remove(report);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Report deleted successfully." });
    }

    // 🔹 Xóa báo cáo về người dùng sau khi xử lý
    [HttpDelete("reports/users/{reportId}")]
    public async Task<IActionResult> DeleteUserReport(int reportId)
    {
        // Tìm báo cáo cần xóa
        var report = await _context.ReportListUsers.FindAsync(reportId);
        if (report == null)
        {
            return NotFound("Report not found.");
        }

        // Xóa báo cáo
        _context.ReportListUsers.Remove(report);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User report deleted successfully." });
    }

}
