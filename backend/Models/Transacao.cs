using ControleGastos.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models
{
    public class Transacao
    {
        public int Id { get; set; }

        [MaxLength (400)]
        public string? Descricao { get; set; }

        public decimal Valor {  get; set; }

        public TipoTransacao? Tipo { get; set; }

        public int PessoaId { get; set; }

        public Pessoa? Pessoa { get; set; }

        public int CategoriaId { get; set; }

        public Categoria? Categoria { get; set; }

    }
}
