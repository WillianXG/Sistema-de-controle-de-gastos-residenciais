using ControleGastos.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; }

        public FinalidadeCategoria Finalidade { get; set; }
    }
}
