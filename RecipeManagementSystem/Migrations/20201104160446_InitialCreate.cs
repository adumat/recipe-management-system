using Microsoft.EntityFrameworkCore.Migrations;

namespace RecipeManagementSystem.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "rms_ingredient_category",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_ingredient_category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "rms_recipe",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(nullable: false),
                    Introduction = table.Column<string>(nullable: false),
                    FinalConsiderations = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_recipe", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "rms_recipe_tag",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: false),
                    ParentTagId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_recipe_tag", x => x.Id);
                    table.ForeignKey(
                        name: "FK_rms_recipe_tag_rms_recipe_tag_ParentTagId",
                        column: x => x.ParentTagId,
                        principalTable: "rms_recipe_tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "rms_ingredient",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    CategoryId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_ingredient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_rms_ingredient_rms_ingredient_category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "rms_ingredient_category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "rms_recipe_step",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RecipeId = table.Column<int>(nullable: true),
                    Description = table.Column<string>(nullable: false),
                    OrderIdx = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_recipe_step", x => x.Id);
                    table.ForeignKey(
                        name: "FK_rms_recipe_step_rms_recipe_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "rms_recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "rms_recipe_tag_map",
                columns: table => new
                {
                    RecipeId = table.Column<int>(nullable: false),
                    RecipeTagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_recipe_tag_map", x => new { x.RecipeId, x.RecipeTagId });
                    table.ForeignKey(
                        name: "FK_rms_recipe_tag_map_rms_recipe_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "rms_recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rms_recipe_tag_map_rms_recipe_tag_RecipeTagId",
                        column: x => x.RecipeTagId,
                        principalTable: "rms_recipe_tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "rms_ingredient_use",
                columns: table => new
                {
                    ReceiptId = table.Column<int>(nullable: false),
                    IngredientId = table.Column<int>(nullable: false),
                    Quantity = table.Column<double>(nullable: false),
                    Unit = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rms_ingredient_use", x => new { x.IngredientId, x.ReceiptId });
                    table.ForeignKey(
                        name: "FK_rms_ingredient_use_rms_ingredient_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "rms_ingredient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rms_ingredient_use_rms_recipe_ReceiptId",
                        column: x => x.ReceiptId,
                        principalTable: "rms_recipe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_rms_ingredient_CategoryId",
                table: "rms_ingredient",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_rms_ingredient_use_ReceiptId",
                table: "rms_ingredient_use",
                column: "ReceiptId");

            migrationBuilder.CreateIndex(
                name: "IX_rms_recipe_step_RecipeId",
                table: "rms_recipe_step",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_rms_recipe_tag_ParentTagId",
                table: "rms_recipe_tag",
                column: "ParentTagId");

            migrationBuilder.CreateIndex(
                name: "IX_rms_recipe_tag_map_RecipeTagId",
                table: "rms_recipe_tag_map",
                column: "RecipeTagId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "rms_ingredient_use");

            migrationBuilder.DropTable(
                name: "rms_recipe_step");

            migrationBuilder.DropTable(
                name: "rms_recipe_tag_map");

            migrationBuilder.DropTable(
                name: "rms_ingredient");

            migrationBuilder.DropTable(
                name: "rms_recipe");

            migrationBuilder.DropTable(
                name: "rms_recipe_tag");

            migrationBuilder.DropTable(
                name: "rms_ingredient_category");
        }
    }
}
