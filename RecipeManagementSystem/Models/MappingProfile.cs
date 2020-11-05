using AutoMapper;
using RecipeManagementSystem.Models.Dto;
using RecipeManagementSystem.Models.Db;
using System.Linq;

namespace RecipeManagementSystem.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //Db to Api
            CreateMap<RecipeTag, RecipeTagDto>()
                .ReverseMap();
            
            CreateMap<IngredientCategory, IngredientCategoryDto>()
                .ReverseMap();

            CreateMap<Ingredient, IngredientDto>()
                .ReverseMap();
            
            CreateMap<RecipeStep, RecipeStepDto>()
                .ReverseMap();
                // .EqualityComparison((rsdto, rs) => rsdto.Id.HasValue ? rsdto.Id == rs.Id : false);
            CreateMap<UseOfIngredient, UseOfIngredientDto>()
                .ReverseMap();
                // .EqualityComparison((uidto, ui) => uidto.IngredientId == ui.IngredientId);
            CreateMap<Recipe, RecipeDto>()
                .ForMember(
                    dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags.Select(tags => tags.RecipeTagId)))
                .ReverseMap()
                .ForMember(
                    dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags.Select(t => new RecipeTagMap { RecipeTagId = t, RecipeId = src.Id }))
                ).ForMember(
                    dest => dest.UseOfIngredients,
                    opt => opt.MapFrom(
                        src => src.UseOfIngredients.Select(ui => new UseOfIngredient {
                            IngredientId = ui.IngredientId,
                            ReceiptId = src.Id,
                            Quantity = ui.Quantity,
                            Unit = ui.Unit
                        })
                    )
                ).ForMember(
                    dest => dest.PreparationSteps,
                    opt => opt.MapFrom(
                        src => src.PreparationSteps.Select(ps => new RecipeStep {
                            Id = ps.Id,
                            Description = ps.Description,
                            OrderIdx = ps.OrderIdx,
                            RecipeId = src.Id
                        })
                    )
                );
        }
    }
}