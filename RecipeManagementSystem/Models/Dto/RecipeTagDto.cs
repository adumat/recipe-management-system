using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace RecipeManagementSystem.Models.Dto
{
    public class RecipeTagDto : IEquatable<RecipeTagDto>
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentTagId { get; set; }

        public override bool Equals(object obj)
        {
            return obj is RecipeTagDto dto &&
                   Equals(dto);
        }

        public bool Equals([AllowNull] RecipeTagDto other)
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
            return (Id == other.Id) && (Name == other.Name) && (Description == other.Description) && (ParentTagId == other.ParentTagId);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name, Description, ParentTagId);
        }
    }
}