using System;
using Microsoft.EntityFrameworkCore;
using RecipeManagementSystem.Models.Db;
using RecipeManagementSystem.Models.Enum;

namespace RecipeManagementSystem.Data
{
    public class RecipeManagementSystemDbContext : DbContext
    {
        public const string RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX = "rms_";

        public RecipeManagementSystemDbContext(DbContextOptions<RecipeManagementSystemDbContext> options)
            : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeTag> RecipeTags { get; set; }
        public DbSet<IngredientCategory> IngredientCategories { get; set; }
        public DbSet<UseOfIngredient> UseOfIngredients { get; set; }
        public DbSet<RecipeStep> RecipeSteps { get; set; }
        public DbSet<RecipeTagMap> RecipeTagMaps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IngredientCategory>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}ingredient_category")
                    .HasKey(t => t.Id);
                
                entity.Property(p => p.Name)
                    .IsRequired();

                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<RecipeTag>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe_tag")
                    .HasKey(t => t.Id);
                
                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();
                
                entity.Property(p => p.Name)
                    .IsRequired();
                
                entity.Property(p => p.Description)
                    .IsRequired();
                
                entity.HasOne(t => t.ParentTag) // self reference for hierarchical structure
                    .WithMany(t => t.ChildrenTag)
                    .HasForeignKey(t => t.ParentTagId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });
            modelBuilder.Entity<Ingredient>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}ingredient")
                    .HasKey(i => i.Id);

                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();
                
                entity.Property(p => p.Name)
                    .IsRequired();
                
                entity.HasOne(i => i.Category)
                    .WithMany(ic => ic.Ingredients)
                    .HasForeignKey(i => i.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe")
                    .HasKey(r => r.Id);
                
                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(p => p.Title)
                    .IsRequired();
                entity.Property(p => p.Introduction)
                    .IsRequired();
                entity.Property(p => p.FinalConsiderations)
                    .IsRequired();
            });
            modelBuilder.Entity<RecipeStep>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe_step")
                    .HasKey(rs => rs.Id);
                
                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();
                
                entity.Property(p => p.Description)
                    .IsRequired();
                entity.Property(p => p.OrderIdx)
                    .IsRequired();
                
                entity.HasOne(rs => rs.Recipe)
                    .WithMany(r => r.PreparationSteps)
                    .HasForeignKey(rs => rs.RecipeId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<UseOfIngredient>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}ingredient_use")
                    .HasKey(ui => new { ui.IngredientId, ui.ReceiptId });

                entity.Property(p => p.Quantity)
                    .IsRequired();

                entity.Property(ui => ui.Unit)
                    .IsRequired()
                    .HasConversion(
                        v => v.ToString(),
                        v => (UnitOfMeasure)Enum.Parse(typeof(UnitOfMeasure), v)
                    );
                
                entity.HasOne(ui => ui.Ingredient)
                    .WithMany(i => i.UsedBy)
                    .HasForeignKey(ui => ui.IngredientId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(ui => ui.Recipe)
                    .WithMany(i => i.UseOfIngredients)
                    .HasForeignKey(ui => ui.ReceiptId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<RecipeTagMap>(entity =>
            {
                entity.ToTable($"{RECIPE_MANAGEMENT_SYSTEM_DB_PREFIX}recipe_tag_map")
                    .HasKey(rtm => new { rtm.RecipeId, rtm.RecipeTagId });
                
                entity.HasOne(rtm => rtm.Tag)
                    .WithMany(t => t.Recipes)
                    .HasForeignKey(rtm => rtm.RecipeTagId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(rtm => rtm.Recipe)
                    .WithMany(r => r.Tags)
                    .HasForeignKey(rtm => rtm.RecipeId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}