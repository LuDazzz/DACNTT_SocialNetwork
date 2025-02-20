using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddReportPostsTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReportTime",
                table: "ReportPosts",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 18, 15, 17, 40, 212, DateTimeKind.Local).AddTicks(4086), new DateTime(2025, 2, 18, 15, 17, 40, 212, DateTimeKind.Local).AddTicks(4101) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReportTime",
                table: "ReportPosts");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 18, 13, 49, 25, 16, DateTimeKind.Local).AddTicks(5028), new DateTime(2025, 2, 18, 13, 49, 25, 16, DateTimeKind.Local).AddTicks(5039) });
        }
    }
}
