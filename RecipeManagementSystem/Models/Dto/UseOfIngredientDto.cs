using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using RecipeManagementSystem.Models.Enum;

namespace RecipeManagementSystem.Models.Dto
{
    public class UseOfIngredientDto : IEquatable<UseOfIngredientDto>
    {
        public static readonly int precision = 7;
        public int IngredientId { get; set; }
        public double Quantity { get; set; }
        public UnitOfMeasure Unit {get; set; }

        public override bool Equals(object obj)
        {
            return obj is UseOfIngredientDto dto &&
                   Equals(dto);
        }

        public bool Equals([AllowNull] UseOfIngredientDto other)
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
            return (IngredientId == other.IngredientId)
                && (Math.Round(Quantity, precision).Equals(Math.Round(other.Quantity, precision)))
                && (Unit == other.Unit);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(IngredientId, Quantity, Unit);
        }
    }
}