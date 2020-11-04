using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace RecipeManagementSystem.Models.Dto
{
    public class RecipeDto : IEquatable<RecipeDto>
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Introduction { get; set; }
        public string FinalConsiderations { get; set; }
        public ICollection<int> Tags { get; set; }
        public ICollection<RecipeStepDto> PreparationSteps { get; set; }
        public ICollection<UseOfIngredientDto> UseOfIngredients { get; set; }

        public override bool Equals(object obj)
        {
            return obj is RecipeDto dto &&
                   Equals(dto);
        }

        public bool Equals([AllowNull] RecipeDto other)
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
                && (Title == other.Title)
                && (Introduction == other.Introduction)
                && (FinalConsiderations == other.FinalConsiderations)
                && (Enumerable.SequenceEqual(Tags.OrderBy(t => t), other.Tags.OrderBy(t => t)))
                && (Enumerable.SequenceEqual(PreparationSteps.OrderBy(t => t.Id), other.PreparationSteps.OrderBy(t => t.Id)))
                && (Enumerable.SequenceEqual(UseOfIngredients.OrderBy(t => t.IngredientId), other.UseOfIngredients.OrderBy(t => t.IngredientId)));
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Title, Introduction, FinalConsiderations, Tags, PreparationSteps, UseOfIngredients);
        }
    }
}