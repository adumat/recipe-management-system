using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RecipeManagementSystem.Controllers;
using RecipeManagementSystem.Data;
using RecipeManagementSystem.Models.Dto;
using Xunit;
using Xunit.Abstractions;

namespace RecipeManagementSystem.Tests
{
    public class IngredientCategoryControllerTest : BaseControllerTest
    {
        public IngredientCategoryControllerTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public async void Can_get_ingredient_categories()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);
                
                var result = (await controller.GetIngredientCategories());

                Assert.Equal(3, (result.Value as ICollection<IngredientCategoryDto>).Count);
                Assert.Contains<IngredientCategoryDto>(mapper.Map<IngredientCategoryDto>(Vegetable), result.Value);
                Assert.Contains<IngredientCategoryDto>(mapper.Map<IngredientCategoryDto>(Meat), result.Value);
                Assert.Contains<IngredientCategoryDto>(mapper.Map<IngredientCategoryDto>(IngredientCategoryToDelete), result.Value);
            }
        }

        [Fact]
        public async void Can_get_ingredient_category_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var result = (await controller.GetIngredientCategory(Meat.Id));

                Assert.Equal<IngredientCategoryDto>(mapper.Map<IngredientCategoryDto>(Meat), result.Value);
            }
        }

        [Fact]
        public async void Cannot_get_ingredient_category_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var result = (await controller.GetIngredientCategory(1000));

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }

        [Fact]
        public async void Can_post_ingredient_category_without_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var objDto = mapper.Map<IngredientCategoryDto>(Meat);
                objDto.Id = null;
                var result = await controller.PostIngredientCategory(objDto);

                var actionResult = Assert.IsType<ActionResult<IngredientCategoryDto>>(result);
                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
                var dto = mapper.Map<IngredientCategoryDto>(createdAtActionResult.Value);
                Assert.NotEqual(Meat.Id, dto.Id);
            }
        }

        [Fact]
        public async void Cannot_post_ingredient_category_with_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var result = await controller.PostIngredientCategory(mapper.Map<IngredientCategoryDto>(Meat));
                var actionResult = Assert.IsType<ActionResult<IngredientCategoryDto>>(result);

                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Cannot_put_ingredient_category_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var dto = new IngredientCategoryDto {
                    Id = 1000,
                    Name = "new"
                };
                var result = await controller.PutIngredientCategory(dto.Id.Value, dto);

                Assert.IsType<NotFoundResult>(result);
            }
        }

        [Fact]
        public async void Can_put_ingredient_category_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var dto = new IngredientCategoryDto {
                    Id = Meat.Id,
                    Name = "changed"
                };
                var result = await controller.PutIngredientCategory(dto.Id.Value, dto);

                Assert.IsType<NoContentResult>(result);
                var newEntity = await controller.GetIngredientCategory(dto.Id.Value);
                Assert.Equal(dto, newEntity.Value);
            }
        }

        [Fact]
        public async void Can_delete_ingredient_category_that_is_used()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var result = await controller.DeleteIngredientCategory(Meat.Id);

                Assert.Equal<IngredientCategoryDto>(mapper.Map<IngredientCategoryDto>(Meat), result.Value);
            }
        }

        [Fact]
        public async void Can_delete_ingredient_category_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var result = await controller.DeleteIngredientCategory(IngredientCategoryToDelete.Id);

                Assert.Equal<IngredientCategoryDto>(mapper.Map<IngredientCategoryDto>(IngredientCategoryToDelete), result.Value);
            }
        }

        [Fact]
        public async void Cannot_delete_ingredient_category_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientCategoryController(context, mapper);

                var result = await controller.DeleteIngredientCategory(1000);

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }
    }
}
