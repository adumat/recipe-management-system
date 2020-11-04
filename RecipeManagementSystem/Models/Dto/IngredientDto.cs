using System;
using System.Diagnostics.CodeAnalysis;

namespace RecipeManagementSystem.Models.Dto
{
    public class IngredientDto : IEquatable<IngredientDto>
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int? CategoryId { get; set; }

        public override bool Equals(object obj)
        {
            return obj is IngredientDto dto &&
                   Equals(dto);
        }

        public bool Equals([AllowNull] IngredientDto other)
        {
            if (Object.ReferenceEquals(other, null))
            {
                return false;
            }
            if (Object.ReferenceEquals(this, other))
            {
                return true;
            }
            if (this.GetType() != other.GetType())
            {
                return false;
            }
            return (Id == other.Id) && (Name == other.Name) && (CategoryId == other.CategoryId);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name, CategoryId);
        }
    }
}