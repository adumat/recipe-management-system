namespace RecipeManagementSystem.Models.Db
{
    public class RecipeTagMap
    {
        // can be null because used inside a recipe, on db side this field cannot be null
        public int? RecipeId { get; set; }
        public int RecipeTagId { get; set; }

        public Recipe Recipe { get; set; }
        public RecipeTag Tag { get; set; }
    }
}