using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Models;
using ControleGastos.Api.Data;
using ControleGastos.Api.Enums;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get() 
        {
            return Ok( await _context.Transacoes.Include(t => t.Pessoa).Include(t => t.Categoria).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Post(Transacao transacao)
        {
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);

            if (pessoa == null || categoria == null)
            {
                return BadRequest("Pessoa ou Categoria inválida");
            }

            if (transacao.Valor <= 0)
            {
                return BadRequest("O valor deve ser positivo");
            }

            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Menor de idade não pode ter receita");
            }

            if (categoria.Finalidade != FinalidadeCategoria.Ambas)
            {
                if (categoria.Finalidade == FinalidadeCategoria.Receita && transacao.Tipo == TipoTransacao.Despesa)
                {
                    return BadRequest("Categoria não permite despesa");
                }

                if (categoria.Finalidade == FinalidadeCategoria.Despesa && transacao.Tipo == TipoTransacao.Receita)
                {
                    return BadRequest("Categoria não permite receita");
                }
            }

            _context.Transacoes.Add(transacao);

            await _context.SaveChangesAsync();

            return Ok(transacao);
        }
    }
}
