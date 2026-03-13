using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Models;
using ControleGastos.Api.Data;
using ControleGastos.Api.Enums;
using ControleGastos.Api.Dtos;

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

        //Buscar Transações
        [HttpGet]
        public async Task<IActionResult> Get() 
        {
            return Ok( await _context.Transacoes.Include(t => t.Pessoa).Include(t => t.Categoria).ToListAsync());
        }

        //Criar e validar a criação de novas Transações
        [HttpPost]
        public async Task<IActionResult> Post(TransacaoCreateDto dto)
        {
            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
            var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);

            if (pessoa == null || categoria == null)
            {
                return BadRequest("Pessoa ou Categoria inválida");
            }

            if (dto.Valor <= 0)
            {
                return BadRequest("Valor deve ser positivo");
            }

            if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Menor de idade não pode ter receita");
            }

            if (categoria.Finalidade == FinalidadeCategoria.Receita && dto.Tipo == TipoTransacao.Despesa)
            {
                return BadRequest("Categoria inválida para despesa");
            }

            if (categoria.Finalidade == FinalidadeCategoria.Despesa && dto.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Categoria inválida para receita");
            }

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                PessoaId = dto.PessoaId,
                CategoriaId = dto.CategoriaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return Ok(transacao);
        }
    }
}
