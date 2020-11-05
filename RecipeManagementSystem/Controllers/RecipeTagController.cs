using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeManagementSystem.Data;
using RecipeManagementSystem.Models.Dto;
using RecipeManagementSystem.Models.Db;
using AutoMapper.QueryableExtensions;

namespace RecipeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeTagController : ControllerBase
    {
        private readonly RecipeManagementSystemDbContext _context;
        private readonly IMapper _mapper;

        public RecipeTagController(RecipeManagementSystemDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/RecipeTag
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<RecipeTagDto>>> GetRecipeTags()
        {
            return await _mapper.ProjectTo<RecipeTagDto>(_context.RecipeTags).ToListAsync();
        }

        // GET: api/RecipeTag/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RecipeTagDto>> GetRecipeTag(int id)
        {
            var recipeTag = await _context.RecipeTags.FindAsync(id);

            if (recipeTag == null)
            {
                return NotFound();
            }

            return _mapper.Map<RecipeTagDto>(recipeTag);
        }

        // PUT: api/RecipeTag/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutRecipeTag(int id, RecipeTagDto recipeTagDto)
        {
            if (id != recipeTagDto.Id)
            {
                return BadRequest();
            }
            if (!RecipeTagExists(id))
            {
                return NotFound();
            }
            if (recipeTagDto.ParentTagId != null)
            {
                if (!await _context.RecipeTags.AnyAsync(rt => rt.Id == recipeTagDto.ParentTagId.Value))
                {
                    return BadRequest();
                }
            }

            var currentRecipeTag = await _context.RecipeTags.FindAsync(id);
            var recipeTag = _mapper.Map<RecipeTagDto, RecipeTag>(recipeTagDto, currentRecipeTag);
            _context.Entry(recipeTag).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/RecipeTag
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RecipeTagDto>> PostRecipeTag(RecipeTagDto recipeTagDto)
        {
            // cannot process a request that contains ids
            if (recipeTagDto.Id != null)
            {
                return BadRequest();
            }
            if (recipeTagDto.ParentTagId != null)
            {
                if (!await _context.RecipeTags.AnyAsync(rt => rt.Id == recipeTagDto.ParentTagId.Value))
                {
                    return BadRequest();
                }
            }

            var recipeTag = _mapper.Map<RecipeTag>(recipeTagDto);
            _context.RecipeTags.Add(recipeTag);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecipeTag", new { id = recipeTag.Id }, recipeTag);
        }

        // DELETE: api/RecipeTag/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RecipeTagDto>> DeleteRecipeTag(int id)
        {
            var recipeTag = await _context.RecipeTags.FindAsync(id);
            if (recipeTag == null)
            {
                return NotFound();
            }

            _context.RecipeTags.Remove(recipeTag);
            await _context.SaveChangesAsync();

            return _mapper.Map<RecipeTagDto>(recipeTag);
        }

        private bool RecipeTagExists(int id)
        {
            return _context.RecipeTags.Any(e => e.Id == id);
        }
    }
}
