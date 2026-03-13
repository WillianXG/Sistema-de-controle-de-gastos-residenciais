using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Enums;
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

        //Buscar Categorias
        [HttpGet]
        public async Task<IActionResult> Get() 
        {
            return Ok(await _context.Categorias.ToListAsync());
        }

        //Criar nova Categoria
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

        //Deletar Categoria
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada" });
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Categoria deletada com sucesso" });
        }

        // Buscar totais por categoria
        [HttpGet("totais")]
        public async Task<IActionResult> GetTotais()
        {
            var categorias = await _context.Categorias
                .Include(c => c.Transacoes)
                .ToListAsync();

            var lista = categorias.Select(c => new CategoriaTotaisDto
            {
                CategoriaId = c.Id,
                Descricao = c.Descricao,
                Finalidade = (int)c.Finalidade, // converter enum para int
                TotalReceitas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                      - c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();

            var response = new CategoriaRelatorioResponse
            {
                Categorias = lista,
                TotalReceitas = lista.Sum(x => x.TotalReceitas),
                TotalDespesas = lista.Sum(x => x.TotalDespesas),
                SaldoTotal = lista.Sum(x => x.Saldo)
            };

            return Ok(response);
        }
    }
}
