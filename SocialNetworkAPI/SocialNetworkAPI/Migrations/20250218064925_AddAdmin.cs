using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "Bio", "CoverPhoto", "DateTimeCreate", "Dob", "Email", "FirstName", "FriendsCount", "Gender", "IsAdmin", "IsOnline", "IsPrivate", "LastLogin", "LastName", "Password", "ProfilePicture", "ResetCode", "Username" },
                values: new object[] { 15, null, null, new DateTime(2025, 2, 18, 13, 49, 25, 16, DateTimeKind.Local).AddTicks(5028), null, "admin@example.com", null, 0, null, true, false, false, new DateTime(2025, 2, 18, 13, 49, 25, 16, DateTimeKind.Local).AddTicks(5039), null, "admin123", null, null, "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15);
        }
    }
}
