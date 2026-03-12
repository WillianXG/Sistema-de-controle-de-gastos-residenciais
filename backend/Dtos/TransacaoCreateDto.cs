using ControleGastos.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos
{
    public class TransacaoCreateDto
    {
        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        [Required]
        public int PessoaId { get; set; }

        [Required]
        public int CategoriaId { get; set; }
    }
}
