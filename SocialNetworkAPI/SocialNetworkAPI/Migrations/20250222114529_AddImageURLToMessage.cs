using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImageURLToMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Messages",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 22, 18, 45, 29, 410, DateTimeKind.Local).AddTicks(3716), new DateTime(2025, 2, 22, 18, 45, 29, 410, DateTimeKind.Local).AddTicks(3726) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 21, 23, 6, 53, 779, DateTimeKind.Local).AddTicks(8553), new DateTime(2025, 2, 21, 23, 6, 53, 779, DateTimeKind.Local).AddTicks(8563) });
        }
    }
}
