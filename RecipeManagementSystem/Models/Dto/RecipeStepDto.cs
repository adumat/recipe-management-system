using System;
using System.Diagnostics.CodeAnalysis;

namespace RecipeManagementSystem.Models.Dto
{
    public class RecipeStepDto : IEquatable<RecipeStepDto>
    {
        public int? Id { get; set; }
        public string Description { get; set; }
        public int OrderIdx { get; set; }

        public override bool Equals(object obj)
        {
            return obj is RecipeStepDto dto &&
                   Equals(dto);
        }

        public bool Equals([AllowNull] RecipeStepDto other)
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
            return (Id == other.Id)
                && (Description == other.Description)
                && (OrderIdx == other.OrderIdx);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Description, OrderIdx);
        }
    }
}
