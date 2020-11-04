using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace RecipeManagementSystem.Models.Dto
{
    public class IngredientCategoryDto : IEquatable<IngredientCategoryDto>
    {
        public int? Id { get; set; }
        public string Name { get; set; }

        public override bool Equals(object obj)
        {
            return obj is IngredientCategoryDto dto &&
                   Equals(dto);
        }

        public bool Equals([AllowNull] IngredientCategoryDto other)
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
            return (Id == other.Id) && (Name == other.Name);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name);
        }
    }
}