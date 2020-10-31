namespace RecipeManagementSystem.Models.Db
{
    public class RecipeTagMap
    {
        public int RecipeId { get; set; }
        public int RecipeTagId { get; set; }

        public Recipe Recipe { get; set; }
        public RecipeTag Tag { get; set; }
    }
}