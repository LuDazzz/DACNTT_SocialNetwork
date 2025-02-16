using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFriendsCounts1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FriendsCount",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FriendsCount",
                table: "Users");
        }
    }
}
