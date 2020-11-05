using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RecipeManagementSystem.Controllers;
using RecipeManagementSystem.Data;
using RecipeManagementSystem.Models.Db;
using RecipeManagementSystem.Models.Dto;
using Xunit;
using Xunit.Abstractions;

namespace RecipeManagementSystem.Tests
{
    public class IngredientControllerTest : BaseControllerTest
    {
        public IngredientControllerTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public async void Can_get_ingredient()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);
                
                var ingredients = (await controller.GetIngredients()).Value as ICollection<IngredientDto>;

                Assert.Equal(4, ingredients.Count);
                Assert.Contains<IngredientDto>(mapper.Map<IngredientDto>(Chicory), ingredients);
                Assert.Contains<IngredientDto>(mapper.Map<IngredientDto>(Chicken), ingredients);
                Assert.Contains<IngredientDto>(mapper.Map<IngredientDto>(Egg), ingredients);
                Assert.Contains<IngredientDto>(mapper.Map<IngredientDto>(IngredientToDelete), ingredients);
            }
        }

        [Fact]
        public async void Can_get_ingredient_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var result = (await controller.GetIngredient(Chicken.Id));

                Assert.Equal<IngredientDto>(mapper.Map<IngredientDto>(Chicken), result.Value);
            }
        }

        [Fact]
        public async void Cannot_get_ingredient_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var result = (await controller.GetIngredient(1000));

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }

        [Fact]
        public async void Can_post_ingredient_without_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var objDto = mapper.Map<IngredientDto>(Chicken);
                objDto.Id = null;
                var result = await controller.PostIngredient(objDto);

                var actionResult = Assert.IsType<ActionResult<IngredientDto>>(result);
                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
                var dto = mapper.Map<IngredientDto>(createdAtActionResult.Value);
                Assert.NotEqual(Chicken.Id, dto.Id);
            }
        }

        [Fact]
        public async void Cannot_post_ingredient_with_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var result = await controller.PostIngredient(mapper.Map<IngredientDto>(Chicken));
                
                var actionResult = Assert.IsType<ActionResult<IngredientDto>>(result);
                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Cannot_post_ingredient_with_parent_invalid()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var dto = new IngredientDto {
                    Name = "new",
                    CategoryId = 1000
                };
                var result = await controller.PostIngredient(dto);
                
                var actionResult = Assert.IsType<ActionResult<IngredientDto>>(result);
                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Cannot_put_ingredient_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var dto = new IngredientDto {
                    Id = 1000,
                    Name = "new"
                };
                var result = await controller.PutIngredient(dto.Id.Value, dto);

                Assert.IsType<NotFoundResult>(result);
            }
        }

        [Fact]
        public async void Cannot_put_ingredient_with_parent_invalid()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var dto = mapper.Map<IngredientDto>(Chicken);
                dto.CategoryId = 1000;
                var result = await controller.PutIngredient(dto.Id.Value, dto);

                Assert.IsType<BadRequestResult>(result);
            }
        }

        [Fact]
        public async void Can_put_ingredient_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var dto = mapper.Map<IngredientDto>(Chicken);
                dto.Name = "changed";
                var result = await controller.PutIngredient(dto.Id.Value, dto);

                Assert.IsType<NoContentResult>(result);

                var newEntity = await controller.GetIngredient(dto.Id.Value);

                Assert.Equal(dto, newEntity.Value);
            }
        }

        [Fact]
        public async void Can_delete_ingredient_category_that_is_used()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var result = await controller.DeleteIngredient(Egg.Id);

                Assert.Equal<IngredientDto>(mapper.Map<IngredientDto>(Egg), result.Value);
            }
        }

        [Fact]
        public async void Can_delete_ingredient_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var result = await controller.DeleteIngredient(IngredientToDelete.Id);

                Assert.Equal<IngredientDto>(mapper.Map<IngredientDto>(IngredientToDelete), result.Value);
            }
        }

        [Fact]
        public async void Cannot_delete_ingredient_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new IngredientController(context, mapper);

                var result = await controller.DeleteIngredient(1000);

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }
    }
}
