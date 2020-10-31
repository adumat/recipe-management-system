namespace RecipeManagementSystem.Models.Db
{
    public class RecipeStep
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public string Description { get; set; }

        public Recipe Recipe { get; set; }
    }
}