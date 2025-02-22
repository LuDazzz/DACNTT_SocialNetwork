using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddjustDbCOnt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_User1UserID",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_User2UserID",
                table: "Friendships");

            migrationBuilder.DropIndex(
                name: "IX_Friendships_User1UserID",
                table: "Friendships");

            migrationBuilder.DropIndex(
                name: "IX_Friendships_User2UserID",
                table: "Friendships");

            migrationBuilder.DropColumn(
                name: "User1UserID",
                table: "Friendships");

            migrationBuilder.DropColumn(
                name: "User2UserID",
                table: "Friendships");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 21, 23, 6, 53, 779, DateTimeKind.Local).AddTicks(8553), new DateTime(2025, 2, 21, 23, 6, 53, 779, DateTimeKind.Local).AddTicks(8563) });

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_UserID2",
                table: "Friendships",
                column: "UserID2");

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Users_UserID1",
                table: "Friendships",
                column: "UserID1",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Users_UserID2",
                table: "Friendships",
                column: "UserID2",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_UserID1",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_UserID2",
                table: "Friendships");

            migrationBuilder.DropIndex(
                name: "IX_Friendships_UserID2",
                table: "Friendships");

            migrationBuilder.AddColumn<int>(
                name: "User1UserID",
                table: "Friendships",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "User2UserID",
                table: "Friendships",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 15,
                columns: new[] { "DateTimeCreate", "LastLogin" },
                values: new object[] { new DateTime(2025, 2, 19, 13, 24, 21, 165, DateTimeKind.Local).AddTicks(3051), new DateTime(2025, 2, 19, 13, 24, 21, 165, DateTimeKind.Local).AddTicks(3061) });

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User1UserID",
                table: "Friendships",
                column: "User1UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User2UserID",
                table: "Friendships",
                column: "User2UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Users_User1UserID",
                table: "Friendships",
                column: "User1UserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Users_User2UserID",
                table: "Friendships",
                column: "User2UserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }
    }
}
