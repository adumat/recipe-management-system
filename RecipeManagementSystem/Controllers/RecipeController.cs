using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeManagementSystem.Data;
using RecipeManagementSystem.Models.Db;
using RecipeManagementSystem.Models.Dto;

namespace RecipeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly RecipeManagementSystemDbContext _context;
        private readonly IMapper _mapper;

        public RecipeController(RecipeManagementSystemDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Recipe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> GetRecipes()
        {
            return await _mapper.ProjectTo<RecipeDto>(_context.Recipes).ToListAsync();
        }

        // GET: api/Recipe/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RecipeDto>> GetRecipe(int id)
        {
            var recipe = await _context.Recipes.Include(r => r.Tags)
                .Include(r => r.PreparationSteps)
                .Include(r => r.UseOfIngredients)
                .SingleOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }

            return _mapper.Map<RecipeDto>(recipe);
        }

        // PUT: api/Recipe/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutRecipe(int id, RecipeDto recipeDto)
        {
            if (id != recipeDto.Id && !RecipeExists(id))
            {
                return BadRequest();
            }
            if (!RecipeExists(id))
            {
                return NotFound();
            }
            var currentRecipe = await _context.Recipes.Include(r => r.Tags)
                .Include(r => r.PreparationSteps)
                .Include(r => r.UseOfIngredients)
                .SingleOrDefaultAsync(r => r.Id == id);
            
            var recipe = _mapper.Map<RecipeDto, Recipe>(recipeDto, currentRecipe);
            _context.Entry(recipe).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Recipe
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RecipeDto>> PostRecipe(RecipeDto recipeDto)
        {
            // cannot process a request that contains ids
            if (recipeDto.Id != null || recipeDto.PreparationSteps.Any(ps => ps.Id != null))
            {
                return BadRequest();
            }

            var recipe = _mapper.Map<Recipe>(recipeDto);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
        }

        // DELETE: api/Recipe/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RecipeDto>> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.Include(r => r.Tags)
                .Include(r => r.PreparationSteps)
                .Include(r => r.UseOfIngredients)
                .SingleOrDefaultAsync(r => r.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return _mapper.Map<RecipeDto>(recipe);
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }
    }
}
