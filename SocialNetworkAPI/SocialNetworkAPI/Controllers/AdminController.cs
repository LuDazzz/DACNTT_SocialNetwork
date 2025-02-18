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
                r.Reason, // Lý do báo cáo
                ReporterID = r.ReporterID,
                ReportedTime = r.ReportTime

            })
            .Join(_context.Users, r => r.ReporterID, u => u.UserID, (r, u) => new
            {
                r.ReportID,
                r.PostContent,
                r.PostDateTime,
                r.Reason,
                Reporter = u.Username, // Tên người báo cáo
            })
            .ToListAsync();

        return Ok(reportedPosts);
    }



    // 🔹 Xóa báo cáo sau khi xử lý
    [HttpDelete("reports/{reportId}")]
    public async Task<IActionResult> DeleteReport(int reportId)
    {
        var report = await _context.ReportListUsers.FindAsync(reportId);
        if (report == null)
        {
            return NotFound("Report not found.");
        }

        _context.ReportListUsers.Remove(report);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Report deleted successfully." });
    }

}
