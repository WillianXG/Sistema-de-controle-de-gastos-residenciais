using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos
{
    public class PessoaCreateDto
    {
        [Required]
        [MaxLength(200)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public int Idade { get; set; }
    }
}
