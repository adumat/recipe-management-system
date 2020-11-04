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
            CreateMap<UseOfIngredient, UseOfIngredientDto>()
                .ReverseMap();
            CreateMap<Recipe, RecipeDto>()
                .ForMember(
                    dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags.Select(tags => tags.RecipeTagId)))
                .ReverseMap()
                .ForMember(
                    dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags.Select(t => new RecipeTagMap { RecipeTagId = t }))
                );
            // CreateMap<UseOfIngredient, UseOfIngredientDto>();
            // CreateMap<UseOfIngredientDto, UseOfIngredient>();

        }
    }
}