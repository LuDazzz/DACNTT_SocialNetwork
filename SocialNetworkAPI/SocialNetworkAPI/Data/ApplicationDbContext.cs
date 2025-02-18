using Microsoft.EntityFrameworkCore;
using SocialNetworkAPI.Models;

namespace SocialNetworkAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Share> Shares { get; set; }
        public DbSet<ReportPost> ReportPosts { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Block> Blocks { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ReportListUser> ReportListUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationship between Post and User
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserID)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete if User is deleted

            // Định nghĩa quan hệ FriendRequest (Sender - Receiver)
            modelBuilder.Entity<FriendRequest>()
                .HasOne(fr => fr.Sender)
                .WithMany()
                .HasForeignKey(fr => fr.SenderID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FriendRequest>()
                .HasOne(fr => fr.Receiver)
                .WithMany()
                .HasForeignKey(fr => fr.ReceiverID)
                .OnDelete(DeleteBehavior.Restrict);

            // Định nghĩa quan hệ Friendship (Bạn bè)
            modelBuilder.Entity<Friendship>()
                .HasKey(f => new { f.UserID1, f.UserID2 });

            // Định nghĩa quan hệ Block (Chặn)
            modelBuilder.Entity<Block>()
                .HasKey(b => new { b.UserID1, b.UserID2 });

            modelBuilder.Entity<Like>()
                .HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostID)
                .OnDelete(DeleteBehavior.Restrict); // Hoặc DeleteBehavior.Cascade tùy nhu cầu

            // Cấu hình quan hệ giữa Like và Comment
            modelBuilder.Entity<Like>()
                .HasOne(l => l.Comment)
                .WithMany(c => c.Likes)
                .HasForeignKey(l => l.CommentID)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ giữa Like và User
            modelBuilder.Entity<Like>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình cho admin
            modelBuilder.Entity<User>().HasData(new User
            {
                UserID = 15,
                Username = "admin",
                Email = "admin@example.com",
                Password = ("admin123"), // Mã hóa mật khẩu
                IsAdmin = true
            });
        }
    }
}