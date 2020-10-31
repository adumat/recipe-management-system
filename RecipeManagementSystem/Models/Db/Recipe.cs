using System.Collections.Generic;

namespace RecipeManagementSystem.Models.Db
{
    /// <summary>
    /// Model that describe a recipe.
    /// A recipe is composed by Ingredients and a list of steps for manipulating them,
    /// in plus can have tags and should have a brief introduction of receipt with eventually finally considerations
    /// </summary>
    public class Recipe
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Introduction { get; set; }
        public string FinalConsiderations { get; set; }
        
        public ICollection<RecipeTagMap> Tags { get; set; }
        public ICollection<RecipeStep> PreparationSteps { get; set; }
        public ICollection<UseOfIngredient> UseOfIngredients { get; set; }
    }
}