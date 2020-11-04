using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using RecipeManagementSystem.Data;
using RecipeManagementSystem.Models.Db;
using RecipeManagementSystem.Models.Enum;
using Xunit.Abstractions;

namespace RecipeManagementSystem.Tests
{
    public class BaseTest
    {

        protected IngredientCategory Vegetable { get; private set; }
        protected IngredientCategory Meat { get; private set; }
        protected IngredientCategory IngredientCategoryToDelete { get; private set; }
        protected Ingredient Chicory { get; private set; }
        protected Ingredient Egg { get; private set; }
        protected Ingredient Chicken { get; private set; }
        protected Ingredient IngredientToDelete { get; private set; }
        protected RecipeTag Side { get; private set; }
        protected RecipeTag Starter { get; private set; }
        protected RecipeTag Dessert { get; private set; }
        protected RecipeTag IceCream { get; private set; }
        protected RecipeTag RecipeTagToDelete { get; private set; }
        protected Recipe Tiramisu { get; private set; }
        protected Recipe RecipeToDelete { get; private set; }
        protected BaseTest(ITestOutputHelper output)
        {
            this.output = output;
            ContextOptions = new DbContextOptionsBuilder<RecipeManagementSystemDbContext>()
                .UseSqlite("Filename=Test.db")
                .Options;

            Seed();
        }

        protected DbContextOptions<RecipeManagementSystemDbContext> ContextOptions { get; }
        protected readonly ITestOutputHelper output;
        private void Seed()
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();

                Vegetable = context.Add(new IngredientCategory {
                    Name = "vegetable"
                }).Entity;
                Meat = context.Add(new IngredientCategory {
                    Name = "meat"
                }).Entity;
                IngredientCategoryToDelete = context.Add(new IngredientCategory {
                    Name = "IngredientCategoryToDelete"
                }).Entity;

                Chicory = context.Add(new Ingredient {
                    Name = "chicory",
                    Category = Vegetable
                }).Entity;
                Egg = context.Add(new Ingredient {
                    Name = "egg",
                    Category = Meat
                }).Entity;
                Chicken = context.Add(new Ingredient {
                    Name = "chicken",
                    Category = Meat
                }).Entity;
                IngredientToDelete = context.Add(new Ingredient {
                    Name = "IngredientToDelete",
                    Category = Meat
                }).Entity;

                Side = context.Add(new RecipeTag {
                    Name = "side",
                    Description = "Side"
                }).Entity;
                Starter = context.Add(new RecipeTag {
                    Name = "starter",
                    Description = "Starter"
                }).Entity;
                Dessert = context.Add(new RecipeTag {
                    Name = "dessert",
                    Description = "Dessert"
                }).Entity;
                IceCream = context.Add(new RecipeTag {
                    Name = "ice cream",
                    Description = "Ice Cream",
                    ParentTag = Dessert
                }).Entity;
                RecipeTagToDelete = context.Add(new RecipeTag {
                    Name = "RecipeTagToDelete",
                    Description = "RecipeTagToDelete",
                    ParentTag = Dessert
                }).Entity;

                Tiramisu = context.Add(new Recipe {
                    Title = "Tiramisu",
                    Introduction = "small intro",
                    FinalConsiderations = "nothing to declare",
                    Tags = new HashSet<RecipeTagMap> {
                        new RecipeTagMap {
                            Tag = Dessert
                        }
                    },
                    UseOfIngredients = new HashSet<UseOfIngredient> {
                        new UseOfIngredient {
                            Ingredient = Egg,
                            Quantity = 2,
                            Unit = UnitOfMeasure.COUNT
                        }
                    },
                    PreparationSteps = new HashSet<RecipeStep> {
                        new RecipeStep {
                            Description = "break eggs",
                            OrderIdx = 1
                        }
                    }
                }).Entity;

                RecipeToDelete = context.Add(new Recipe {
                    Title = "RecipeToDelete",
                    Introduction = "RecipeToDelete intro",
                    FinalConsiderations = "nothing",
                    Tags = new HashSet<RecipeTagMap> {
                        new RecipeTagMap {
                            Tag = Dessert
                        }
                    },
                    UseOfIngredients = new HashSet<UseOfIngredient> {
                        new UseOfIngredient {
                            Ingredient = Egg,
                            Quantity = 2,
                            Unit = UnitOfMeasure.COUNT
                        }
                    },
                    PreparationSteps = new HashSet<RecipeStep> {
                        new RecipeStep {
                            Description = "break eggs",
                            OrderIdx = 1
                        }
                    }
                }).Entity;

                context.SaveChanges();
            }
        }
    }
}