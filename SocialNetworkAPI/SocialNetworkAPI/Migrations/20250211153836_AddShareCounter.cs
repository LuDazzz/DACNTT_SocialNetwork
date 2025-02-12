using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetworkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddShareCounter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ShareCounter",
                table: "Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShareCounter",
                table: "Posts");
        }
    }
}
