using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class addjustmessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Messages",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 22, 19, 2, 13, 197, DateTimeKind.Local).AddTicks(868), new DateTime(2025, 2, 22, 19, 2, 13, 197, DateTimeKind.Local).AddTicks(879) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "ImageUrl",
                keyValue: null,
                column: "ImageUrl",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Messages",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 22, 18, 45, 29, 410, DateTimeKind.Local).AddTicks(3716), new DateTime(2025, 2, 22, 18, 45, 29, 410, DateTimeKind.Local).AddTicks(3726) });
        }
    }
}
