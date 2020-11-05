using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using RecipeManagementSystem.Controllers;
using RecipeManagementSystem.Data;
using RecipeManagementSystem.Models.Dto;
using RecipeManagementSystem.Models.Enum;
using Xunit;
using Xunit.Abstractions;

namespace RecipeManagementSystem.Tests
{
    public class RecipeControllerTest : BaseControllerTest
    {
        public RecipeControllerTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public async void Can_get_recipes()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var result = (await controller.GetRecipes());

                Assert.Equal(2, (result.Value as ICollection<RecipeDto>).Count);
                Assert.Contains<RecipeDto>(mapper.Map<RecipeDto>(Tiramisu), result.Value);
                Assert.Contains<RecipeDto>(mapper.Map<RecipeDto>(RecipeToDelete), result.Value);
            }
        }

        [Fact]
        public async void Can_get_recipe_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var result = (await controller.GetRecipe(Tiramisu.Id));
                
                Assert.Equal<RecipeDto>(mapper.Map<RecipeDto>(Tiramisu), result.Value);
            }
        }

        [Fact]
        public async void Cannot_get_recipe_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var result = (await controller.GetRecipe(1000));

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }

        [Fact]
        public async void Can_post_recipe_without_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var objDto = mapper.Map<RecipeDto>(Tiramisu);
                objDto.Id = null;
                foreach (var item in objDto.PreparationSteps)
                {
                    item.Id = null;
                }
                var result = await controller.PostRecipe(objDto);

                var actionResult = Assert.IsType<ActionResult<RecipeDto>>(result);
                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
                var dto = mapper.Map<RecipeDto>(createdAtActionResult.Value);
                Assert.NotEqual(Tiramisu.Id, dto.Id);
            }
        }

        [Fact]
        public async void Cannot_post_recipe_with_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var result = await controller.PostRecipe(mapper.Map<RecipeDto>(Tiramisu));
                
                var actionResult = Assert.IsType<ActionResult<RecipeDto>>(result);
                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Cannot_put_recipe_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var dto = new RecipeDto {
                    Id = 50,
                    Title = "",
                    Introduction = "",
                    FinalConsiderations = "",
                    Tags = new List<int> {Side.Id},
                    UseOfIngredients = new List<UseOfIngredientDto> {
                        new UseOfIngredientDto {
                            IngredientId = Chicken.Id,
                            Quantity = 100
                        }
                    }
                };
                var result = await controller.PutRecipe(dto.Id.Value, dto);

                Assert.IsType<NotFoundResult>(result);
            }
        }

        [Fact]
        public async void Can_put_recipe_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var dto = mapper.Map<RecipeDto>(Tiramisu);
                dto.Introduction = "changed";
                dto.Tags.Add(Side.Id);
                dto.UseOfIngredients.Add(new UseOfIngredientDto {
                    IngredientId = Chicken.Id,
                    Quantity = 2,
                    Unit = UnitOfMeasure.SPOON
                });
                dto.PreparationSteps.Add(new RecipeStepDto {
                    Description = "great classic: chickenmisu",
                    OrderIdx = 2
                });
                var result = await controller.PutRecipe(dto.Id.Value, dto);

                Assert.IsType<NoContentResult>(result);
                var newEntity = await controller.GetRecipe(dto.Id.Value);
                var newDto = newEntity.Value as RecipeDto;
                //for check if is equal, i need to copy back the newest idx of preparation step
                var newestPS = newDto.PreparationSteps.Single(newPSDto => newPSDto.OrderIdx == 2);
                var oldestPS = dto.PreparationSteps.Single(oldPSDto => oldPSDto.OrderIdx == 2);
                oldestPS.Id = newestPS.Id;
                Assert.Equal(dto, newDto);
            }
        }

        [Fact]
        public async void Can_delete_recipe_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var result = await controller.DeleteRecipe(RecipeToDelete.Id);

                Assert.Equal<RecipeDto>(mapper.Map<RecipeDto>(RecipeToDelete), result.Value);
            }
        }

        [Fact]
        public async void Cannot_delete_recipe_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeController(context, mapper);

                var result = await controller.DeleteRecipe(1000);

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }
    }
}
