using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLikeCounter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LikeCounter",
                table: "Likes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikeCounter",
                table: "Likes");
        }
    }
}
