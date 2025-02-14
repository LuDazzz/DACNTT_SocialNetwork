using Microsoft.AspNetCore.Mvc;
using SocialNetworkAPI.Models;
using SocialNetworkAPI.Data;
using System.Threading.Tasks;
using System;

namespace SocialNetworkAPI.Controllers
{
    [Route("api/report")]
    [ApiController]
    public class ReportListUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportListUserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Báo cáo người dùng
        [HttpPost("user")]
        public async Task<IActionResult> ReportUser([FromBody] ReportListUser report)
        {
            if (report.SenderID == report.UserIsReported)
                return BadRequest("You cannot report yourself");

            _context.ReportListUsers.Add(report);
            await _context.SaveChangesAsync();

            return Ok("User is reported.");
        }
    }
}
