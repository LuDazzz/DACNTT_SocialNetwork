using SocialNetworkAPI.Data;

namespace SocialNetworkAPI
{
    public class AdminAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AdminAuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ApplicationDbContext _context)
        {
            var userId = context.User.FindFirst("UserID")?.Value;
            if (userId == null)
            {
                context.Response.StatusCode = 403; // Forbidden
                await context.Response.WriteAsync("Unauthorized: Admin access required.");
                return;
            }

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null || !user.IsAdmin)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Unauthorized: Admin access required.");
                return;
            }

            await _next(context);
        }
    }

}
