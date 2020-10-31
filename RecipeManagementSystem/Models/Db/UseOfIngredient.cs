namespace RecipeManagementSystem.Models.Db
{
    public class UseOfIngredient
    {
        public int IdReceipt { get; set; }
        public int IdIngredient { get; set; }

        public virtual Recipe Recipe { get; set; }
        public virtual Ingredient Ingredient { get; set; }
    }
}