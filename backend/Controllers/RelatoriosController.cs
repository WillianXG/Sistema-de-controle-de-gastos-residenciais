using ControleGastos.Api.Data;
using ControleGastos.Api.Enums;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context) 
        {
            _context = context;
        }

        [HttpGet("pessoas")]
        public async Task<IActionResult> TotaisPorPessoa() 
        {
            var dados = await _context.Pessoas.Select(p => new
            {
                Pessoa = p.Nome,
                Receitas = (p.Transacoes ?? new List<Transacao>()).Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0,
                Despesas = (p.Transacoes ?? new List<Transacao>()).Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0
            }).ToListAsync();

            var resultado = dados.Select(d => new
            {
                d.Pessoa,
                d.Receitas,
                d.Despesas,
                Saldo = d.Receitas - d.Despesas
            });

            return Ok(resultado);
        }
    }
}
