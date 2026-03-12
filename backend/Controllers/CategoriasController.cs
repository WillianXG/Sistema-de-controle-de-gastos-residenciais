using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get() 
        {
            return Ok(await _context.Categorias.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Post(CategoriaCreateDto dto) 
        {
            var categoria = new Categoria
            {
                Descricao = dto.Descricao,
                Finalidade = dto.Finalidade
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return Ok(categoria);
        }
    }
}
