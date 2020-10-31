using Microsoft.EntityFrameworkCore;
using RecipeManagementSystem.Models.Db;

namespace RecipeManagementSystem.Data
{
    public class RecipeManagementSystemDbContext : DbContext
    {
        public const string RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX = "rms_";

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeTag> RecipeTags { get; set; }
        public DbSet<IngredientCategory> IngredientCategories { get; set; }
        public DbSet<UseOfIngredient> UseOfIngredients { get; set; }
        public DbSet<RecipeStep> RecipeSteps { get; set; }
        public DbSet<RecipeTagMap> RecipeTagMaps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Table definitions (name, primary key)
            modelBuilder.Entity<IngredientCategory>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}ingredient_category")
                .HasKey(t => t.Id);
            modelBuilder.Entity<RecipeTag>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe_tag")
                .HasKey(t => t.Id);
            modelBuilder.Entity<Ingredient>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}ingredient")
                .HasKey(i => i.Id);
            modelBuilder.Entity<Recipe>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe")
                .HasKey(r => r.Id);
            modelBuilder.Entity<RecipeStep>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe_step")
                .HasKey(rs => rs.Id);
            modelBuilder.Entity<UseOfIngredient>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}ingredient_use")
                .HasKey(ui => new { ui.IdIngredient, ui.IdReceipt });
            modelBuilder.Entity<RecipeTagMap>()
                .ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe_tag_map")
                .HasKey(rtm => new { rtm.RecipeId, rtm.RecipeTagId });

            // Definitions of foreign keys
            modelBuilder.Entity<RecipeTag>() //self reference for hierarchical structure
                .HasOne(t => t.ParentTag)
                .WithMany(t => t.ChildrenTag)
                .HasForeignKey(t => t.ParentTagId);
            modelBuilder.Entity<RecipeTagMap>()
                .HasOne(rtm => rtm.Tag)
                .WithMany(t => t.Recipes)
                .HasForeignKey(rtm => rtm.RecipeTagId);
            modelBuilder.Entity<RecipeTagMap>()
                .HasOne(rtm => rtm.Recipe)
                .WithMany(r => r.Tags)
                .HasForeignKey(rtm => rtm.Recipe);
            modelBuilder.Entity<Ingredient>()
                .HasOne(i => i.Category)
                .WithMany(ic => ic.Ingredients)
                .HasForeignKey(i => i.CategoryId);
            modelBuilder.Entity<UseOfIngredient>()
                .HasOne(ui => ui.Ingredient)
                .WithMany(i => i.UsedBy)
                .HasForeignKey(ui => ui.IdIngredient);
            modelBuilder.Entity<UseOfIngredient>()
                .HasOne(ui => ui.Recipe)
                .WithMany(i => i.UseOfIngredients)
                .HasForeignKey(ui => ui.IdReceipt);
            modelBuilder.Entity<RecipeStep>()
                .HasOne(rs => rs.Recipe)
                .WithMany(r => r.PreparationSteps)
                .HasForeignKey(rs => rs.RecipeId);
        }
    }
}