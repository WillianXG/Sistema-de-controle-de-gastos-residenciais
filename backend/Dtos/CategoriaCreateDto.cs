using ControleGastos.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos
{
    public class CategoriaCreateDto
    {
        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; } =string.Empty;

        [Required]
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
