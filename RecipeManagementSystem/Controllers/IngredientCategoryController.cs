using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class IngredientCategoryController : ControllerBase
    {
        private readonly RecipeManagementSystemDbContext _context;
        private readonly IMapper _mapper;

        public IngredientCategoryController(RecipeManagementSystemDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/IngredientCategory
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<IngredientCategoryDto>>> GetIngredientCategories()
        {
            return await _mapper.ProjectTo<IngredientCategoryDto>(_context.IngredientCategories).ToListAsync();
        }

        // GET: api/IngredientCategory/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IngredientCategoryDto>> GetIngredientCategory(int id)
        {
            var ingredientCategory = await _context.IngredientCategories.FindAsync(id);

            if (ingredientCategory == null)
            {
                return NotFound();
            }

            return _mapper.Map<IngredientCategoryDto>(ingredientCategory);
        }

        // PUT: api/IngredientCategory/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutIngredientCategory(int id, IngredientCategoryDto ingredientCategoryDto)
        {
            if (id != ingredientCategoryDto.Id)
            {
                return BadRequest();
            }
            
            var ingredientCategory = _mapper.Map<IngredientCategory>(ingredientCategoryDto);
            _context.Entry(ingredientCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngredientCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/IngredientCategory
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IngredientCategoryDto>> PostIngredientCategory(IngredientCategoryDto ingredientCategoryDto)
        {
            // cannot process a request that contains ids
            if (ingredientCategoryDto.Id != null)
            {
                return BadRequest();
            }

            var ingredientCategory = _mapper.Map<IngredientCategory>(ingredientCategoryDto);
            _context.IngredientCategories.Add(ingredientCategory);
            await _context.SaveChangesAsync();
            ingredientCategoryDto.Id = ingredientCategory.Id;

            return CreatedAtAction("GetIngredientCategory", new { id = ingredientCategory.Id }, ingredientCategoryDto);
        }

        // DELETE: api/IngredientCategory/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IngredientCategoryDto>> DeleteIngredientCategory(int id)
        {
            var ingredientCategory = await _context.IngredientCategories.FindAsync(id);
            if (ingredientCategory == null)
            {
                return NotFound();
            }

            _context.IngredientCategories.Remove(ingredientCategory);
            await _context.SaveChangesAsync();

            return _mapper.Map<IngredientCategoryDto>(ingredientCategory);
        }

        private bool IngredientCategoryExists(int id)
        {
            return _context.IngredientCategories.Any(e => e.Id == id);
        }
    }
}
