using System.Collections.Generic;

namespace RecipeManagementSystem.Models.Db
{
    public class IngredientCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Ingredient> Ingredients { get; set; } 
    }
}