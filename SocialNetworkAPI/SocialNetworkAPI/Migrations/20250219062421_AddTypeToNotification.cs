using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTypeToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Notifications",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 19, 13, 24, 21, 165, DateTimeKind.Local).AddTicks(3051), new DateTime(2025, 2, 19, 13, 24, 21, 165, DateTimeKind.Local).AddTicks(3061) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Notifications");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 18, 15, 17, 40, 212, DateTimeKind.Local).AddTicks(4086), new DateTime(2025, 2, 18, 15, 17, 40, 212, DateTimeKind.Local).AddTicks(4101) });
        }
    }
}
