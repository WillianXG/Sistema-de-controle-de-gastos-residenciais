using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Enums;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Put(int id, Pessoa pessoa)
        {
            var p = await _context.Pessoas.FindAsync(id);

            if (p == null)
            {
                return NotFound();
            }

            p.Nome = pessoa.Nome;
            p.Idade = pessoa.Idade;

            await _context.SaveChangesAsync();

            return Ok(p);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id) 
        {
            var p = await _context.Pessoas.Include(p => p.Transacoes).FirstOrDefaultAsync(p => p.Id == id);

            if (p == null) 
            {
                return NotFound();
            }

            if (p.Transacoes != null) 
            {
                _context.Transacoes.RemoveRange(p.Transacoes);
            }
            _context.Pessoas.Remove(p);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("totais")]
        public async Task<ActionResult<TotaisPessoasDto>> GetTotaisPorPessoa()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            var resumo = pessoas.Select(p => new PessoaResumoDto
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                TotalReceitas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor),

                TotalDespesas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor),

                Saldo = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor)
                    -
                    p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor)
            }).ToList();

            var totalReceitas = resumo.Sum(r => r.TotalReceitas);
            var totalDespesas = resumo.Sum(r => r.TotalDespesas);

            var resultado = new TotaisPessoasDto
            {
                Pessoas = resumo,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                SaldoTotal = totalReceitas - totalDespesas
            };

            return Ok(resultado);
        }
    }
}
