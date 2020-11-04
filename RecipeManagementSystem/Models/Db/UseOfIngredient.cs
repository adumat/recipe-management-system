using RecipeManagementSystem.Models.Enum;

namespace RecipeManagementSystem.Models.Db
{
    public class UseOfIngredient
    {
        public int ReceiptId { get; set; }
        public int IngredientId { get; set; }
        public double Quantity { get; set; }
        public UnitOfMeasure Unit {get; set; } = UnitOfMeasure.GRAMS;

        public Recipe Recipe { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}