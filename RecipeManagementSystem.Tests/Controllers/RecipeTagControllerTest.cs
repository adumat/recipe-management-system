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
    public class RecipeTagControllerTest : BaseControllerTest
    {
        public RecipeTagControllerTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public async void Can_get_recipe_tags()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var recipeTags = (await controller.GetRecipeTags()).Value as ICollection<RecipeTagDto>;

                Assert.Equal(5, recipeTags.Count);
                Assert.Contains<RecipeTagDto>(mapper.Map<RecipeTagDto>(Side), recipeTags);
                Assert.Contains<RecipeTagDto>(mapper.Map<RecipeTagDto>(Starter), recipeTags);
                Assert.Contains<RecipeTagDto>(mapper.Map<RecipeTagDto>(Dessert), recipeTags);
                Assert.Contains<RecipeTagDto>(mapper.Map<RecipeTagDto>(IceCream), recipeTags);
                Assert.Contains<RecipeTagDto>(mapper.Map<RecipeTagDto>(RecipeTagToDelete), recipeTags);
            }
        }

        [Fact]
        public async void Can_get_recipe_tag_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var result = (await controller.GetRecipeTag(Dessert.Id));

                Assert.Equal<RecipeTagDto>(mapper.Map<RecipeTagDto>(Dessert), result.Value);
            }
        }

        [Fact]
        public async void Cannot_get_recipe_tag_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var result = (await controller.GetRecipeTag(1000));

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }

        [Fact]
        public async void Can_post_recipe_tag_without_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var objDto = mapper.Map<RecipeTagDto>(Dessert);
                objDto.Id = null;
                var result = await controller.PostRecipeTag(objDto);

                var actionResult = Assert.IsType<ActionResult<RecipeTagDto>>(result);
                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
                var dto = mapper.Map<RecipeTagDto>(createdAtActionResult.Value);
                Assert.NotEqual(Dessert.Id, dto.Id);
            }
        }

        [Fact]
        public async void Cannot_post_recipe_tag_with_ids()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var result = await controller.PostRecipeTag(mapper.Map<RecipeTagDto>(Dessert));
                var actionResult = Assert.IsType<ActionResult<RecipeTagDto>>(result);

                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Cannot_post_recipe_tag_with_parent_invalid()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var dto = new RecipeTagDto {
                    Name = "new",
                    Description = "new",
                    ParentTagId = 1000
                };
                var result = await controller.PostRecipeTag(dto);

                var actionResult = Assert.IsType<ActionResult<RecipeTagDto>>(result);
                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Cannot_put_recipe_tag_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var dto = new RecipeTagDto {
                    Id = 1000,
                    Name = "new",
                    Description = "new"
                };
                var result = await controller.PutRecipeTag(dto.Id.Value, dto);

                Assert.IsType<NotFoundResult>(result);
            }
        }

        [Fact]
        public async void Cannot_put_recipe_tag_with_parent_invalid()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var dto = new RecipeTagDto {
                    Id = Dessert.Id,
                    Name = "new",
                    Description = "new",
                    ParentTagId = 1000
                };
                var result = await controller.PutRecipeTag(dto.Id.Value, dto);

                var actionResult = Assert.IsType<ActionResult<RecipeTagDto>>(result);
                Assert.IsType<BadRequestResult>(actionResult.Result);
            }
        }

        [Fact]
        public async void Can_put_recipe_tag_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var dto = new RecipeTagDto {
                    Id = Dessert.Id,
                    Name = "changed",
                    Description = Dessert.Description
                };
                var result = await controller.PutRecipeTag(dto.Id.Value, dto);

                Assert.IsType<NoContentResult>(result);
                var newEntity = await controller.GetRecipeTag(dto.Id.Value);
                Assert.Equal(dto, newEntity.Value);
            }
        }
        [Fact]
        public async void Can_delete_recipe_tag_that_is_used()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var result = await controller.DeleteRecipeTag(Dessert.Id);

                Assert.Equal<RecipeTagDto>(mapper.Map<RecipeTagDto>(Dessert), result.Value);
            }
        }

        [Fact]
        public async void Can_delete_recipe_tag_that_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);
                
                var result = await controller.DeleteRecipeTag(RecipeTagToDelete.Id);

                Assert.Equal<RecipeTagDto>(mapper.Map<RecipeTagDto>(RecipeTagToDelete), result.Value);
            }
        }

        [Fact]
        public async void Cannot_delete_recipe_tag_that_not_exist()//verified
        {
            using (var context = new RecipeManagementSystemDbContext(ContextOptions))
            {
                var controller = new RecipeTagController(context, mapper);

                var result = await controller.DeleteRecipeTag(1000);

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }
    }
}
