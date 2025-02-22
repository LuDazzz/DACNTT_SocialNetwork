﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SocialNetworkAPI.Data;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.20")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("SocialNetworkAPI.Models.Block", b =>
                {
                    b.Property<int>("UserID1")
                        .HasColumnType("int");

                    b.Property<int>("UserID2")
                        .HasColumnType("int");

                    b.Property<int>("BlockID")
                        .HasColumnType("int");

                    b.Property<int?>("BlockedUserUserID")
                        .HasColumnType("int");

                    b.Property<int?>("BlockerUserID")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("UserID1", "UserID2");

                    b.HasIndex("BlockedUserUserID");

                    b.HasIndex("BlockerUserID");

                    b.ToTable("Blocks");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Comment", b =>
                {
                    b.Property<int>("CommentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DateTimeUpdated")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsUpdated")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("PostID")
                        .HasColumnType("int");

                    b.Property<int?>("ReplyForID")
                        .HasColumnType("int");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("CommentID");

                    b.HasIndex("PostID");

                    b.HasIndex("UserID");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.FriendRequest", b =>
                {
                    b.Property<int>("RequestID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("ReceiverID")
                        .HasColumnType("int");

                    b.Property<int>("SenderID")
                        .HasColumnType("int");

                    b.HasKey("RequestID");

                    b.HasIndex("ReceiverID");

                    b.HasIndex("SenderID");

                    b.ToTable("FriendRequests");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Friendship", b =>
                {
                    b.Property<int>("UserID1")
                        .HasColumnType("int");

                    b.Property<int>("UserID2")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("FriendshipID")
                        .HasColumnType("int");

                    b.HasKey("UserID1", "UserID2");

                    b.HasIndex("UserID2");

                    b.ToTable("Friendships");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Like", b =>
                {
                    b.Property<int>("LikeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("CommentID")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("PostID")
                        .HasColumnType("int");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("LikeID");

                    b.HasIndex("CommentID");

                    b.HasIndex("PostID");

                    b.HasIndex("UserID");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Message", b =>
                {
                    b.Property<int>("MessageID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("longtext");

                    b.Property<string>("MediaType")
                        .HasColumnType("longtext");

                    b.Property<int>("ReceiverID")
                        .HasColumnType("int");

                    b.Property<int>("SenderID")
                        .HasColumnType("int");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("datetime(6)");

                    b.HasKey("MessageID");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Notification", b =>
                {
                    b.Property<int>("NotiID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsRead")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("SenderID")
                        .HasColumnType("int");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("NotiID");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Post", b =>
                {
                    b.Property<int>("PostID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("CommentCounter")
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DateTimeUpdated")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsUpdated")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("LikeCounter")
                        .HasColumnType("int");

                    b.Property<string>("MediaType")
                        .HasColumnType("longtext");

                    b.Property<string>("MediaURL")
                        .HasColumnType("longtext");

                    b.Property<int>("ShareCounter")
                        .HasColumnType("int");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("PostID");

                    b.HasIndex("UserID");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.ReportListUser", b =>
                {
                    b.Property<int>("ReportID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Reason")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<int?>("ReportedUserUserID")
                        .HasColumnType("int");

                    b.Property<int?>("ReporterUserID")
                        .HasColumnType("int");

                    b.Property<int>("SenderID")
                        .HasColumnType("int");

                    b.Property<int>("UserIsReported")
                        .HasColumnType("int");

                    b.HasKey("ReportID");

                    b.HasIndex("ReportedUserUserID");

                    b.HasIndex("ReporterUserID");

                    b.ToTable("ReportListUsers");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.ReportPost", b =>
                {
                    b.Property<int>("ReportID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("PostID")
                        .HasColumnType("int");

                    b.Property<string>("Reason")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<DateTime>("ReportTime")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("ReporterID")
                        .HasColumnType("int");

                    b.HasKey("ReportID");

                    b.HasIndex("PostID");

                    b.HasIndex("ReporterID");

                    b.ToTable("ReportPosts");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Share", b =>
                {
                    b.Property<int>("ShareID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("PostID")
                        .HasColumnType("int");

                    b.Property<int>("UserShareID")
                        .HasColumnType("int");

                    b.HasKey("ShareID");

                    b.HasIndex("PostID");

                    b.HasIndex("UserShareID");

                    b.ToTable("Shares");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Bio")
                        .HasColumnType("longtext");

                    b.Property<byte[]>("CoverPhoto")
                        .HasColumnType("longblob");

                    b.Property<DateTime>("DateTimeCreate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("Dob")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<int>("FriendsCount")
                        .HasColumnType("int");

                    b.Property<string>("Gender")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsOnline")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime?>("LastLogin")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte[]>("ProfilePicture")
                        .HasColumnType("longblob");

                    b.Property<string>("ResetCode")
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.HasKey("UserID");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            UserID = 15,
                            DateTimeCreate = new DateTime(2025, 2, 22, 19, 2, 13, 197, DateTimeKind.Local).AddTicks(868),
                            Email = "admin@example.com",
                            FriendsCount = 0,
                            IsAdmin = true,
                            IsOnline = false,
                            IsPrivate = false,
                            LastLogin = new DateTime(2025, 2, 22, 19, 2, 13, 197, DateTimeKind.Local).AddTicks(879),
                            Password = "admin123",
                            Username = "admin"
                        });
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Block", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.User", "BlockedUser")
                        .WithMany()
                        .HasForeignKey("BlockedUserUserID");

                    b.HasOne("SocialNetworkAPI.Models.User", "Blocker")
                        .WithMany()
                        .HasForeignKey("BlockerUserID");

                    b.Navigation("BlockedUser");

                    b.Navigation("Blocker");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Comment", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SocialNetworkAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.FriendRequest", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.User", "Receiver")
                        .WithMany()
                        .HasForeignKey("ReceiverID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SocialNetworkAPI.Models.User", "Sender")
                        .WithMany()
                        .HasForeignKey("SenderID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Receiver");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Friendship", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.User", "User1")
                        .WithMany()
                        .HasForeignKey("UserID1")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SocialNetworkAPI.Models.User", "User2")
                        .WithMany()
                        .HasForeignKey("UserID2")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User1");

                    b.Navigation("User2");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Like", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.Comment", "Comment")
                        .WithMany("Likes")
                        .HasForeignKey("CommentID")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("SocialNetworkAPI.Models.Post", "Post")
                        .WithMany("Likes")
                        .HasForeignKey("PostID")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("SocialNetworkAPI.Models.User", "User")
                        .WithMany("Likes")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Comment");

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Post", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.User", "User")
                        .WithMany("Posts")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.ReportListUser", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.User", "ReportedUser")
                        .WithMany()
                        .HasForeignKey("ReportedUserUserID");

                    b.HasOne("SocialNetworkAPI.Models.User", "Reporter")
                        .WithMany()
                        .HasForeignKey("ReporterUserID");

                    b.Navigation("ReportedUser");

                    b.Navigation("Reporter");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.ReportPost", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.Post", "Post")
                        .WithMany()
                        .HasForeignKey("PostID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SocialNetworkAPI.Models.User", "Reporter")
                        .WithMany()
                        .HasForeignKey("ReporterID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("Reporter");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Share", b =>
                {
                    b.HasOne("SocialNetworkAPI.Models.Post", "Post")
                        .WithMany()
                        .HasForeignKey("PostID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SocialNetworkAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserShareID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Comment", b =>
                {
                    b.Navigation("Likes");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.Post", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Likes");
                });

            modelBuilder.Entity("SocialNetworkAPI.Models.User", b =>
                {
                    b.Navigation("Likes");

                    b.Navigation("Posts");
                });
#pragma warning restore 612, 618
        }
    }
}
