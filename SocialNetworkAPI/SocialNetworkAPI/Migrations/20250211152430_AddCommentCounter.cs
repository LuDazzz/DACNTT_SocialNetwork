using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentCounter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CommentCounter",
                table: "Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentCounter",
                table: "Posts");
        }
    }
}
