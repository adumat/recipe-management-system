using System.Collections.Generic;

namespace RecipeManagementSystem.Models.Db
{
    /// <summary>
    /// Meaning of this Model is to create a hierarchical Tags that can be assigned on recipe and on ingredients
    /// in a flexible way
    /// </summary>
    public class RecipeTag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentTagId { get; set; }

        public RecipeTag ParentTag { get; set; }
        public ICollection<RecipeTag> ChildrenTag { get; set; }
        public ICollection<RecipeTagMap> Recipes { get; set; }
    }
}