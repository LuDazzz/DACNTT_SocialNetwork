using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixNullableValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockedUserUserID",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockerUserID",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_User1UserID",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_User2UserID",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_ReportListUsers_Users_ReportedUserUserID",
                table: "ReportListUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ReportListUsers_Users_ReporterUserID",
                table: "ReportListUsers");

            migrationBuilder.AlterColumn<int>(
                name: "ReporterUserID",
                table: "ReportListUsers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ReportedUserUserID",
                table: "ReportListUsers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "User2UserID",
                table: "Friendships",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "User1UserID",
                table: "Friendships",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "BlockerUserID",
                table: "Blocks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "BlockedUserUserID",
                table: "Blocks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockedUserUserID",
                table: "Blocks",
                column: "BlockedUserUserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockerUserID",
                table: "Blocks",
                column: "BlockerUserID",
                principalTable: "Users",
                principalColumn: "UserID");

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

            migrationBuilder.AddForeignKey(
                name: "FK_ReportListUsers_Users_ReportedUserUserID",
                table: "ReportListUsers",
                column: "ReportedUserUserID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ReportListUsers_Users_ReporterUserID",
                table: "ReportListUsers",
                column: "ReporterUserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockedUserUserID",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockerUserID",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_User1UserID",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Users_User2UserID",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_ReportListUsers_Users_ReportedUserUserID",
                table: "ReportListUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ReportListUsers_Users_ReporterUserID",
                table: "ReportListUsers");

            migrationBuilder.AlterColumn<int>(
                name: "ReporterUserID",
                table: "ReportListUsers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ReportedUserUserID",
                table: "ReportListUsers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "User2UserID",
                table: "Friendships",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "User1UserID",
                table: "Friendships",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BlockerUserID",
                table: "Blocks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BlockedUserUserID",
                table: "Blocks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockedUserUserID",
                table: "Blocks",
                column: "BlockedUserUserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockerUserID",
                table: "Blocks",
                column: "BlockerUserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Users_User1UserID",
                table: "Friendships",
                column: "User1UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Users_User2UserID",
                table: "Friendships",
                column: "User2UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReportListUsers_Users_ReportedUserUserID",
                table: "ReportListUsers",
                column: "ReportedUserUserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReportListUsers_Users_ReporterUserID",
                table: "ReportListUsers",
                column: "ReporterUserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
