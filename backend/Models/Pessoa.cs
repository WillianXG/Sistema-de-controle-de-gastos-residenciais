using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models
{
    public class Pessoa
    {

        public int Id { get; set; }

        [MaxLength(200)]
        public string Nome { get; set; }

        public int Idade { get; set; }

        public List<Transacao>? Transacoes { get; set; }

    }
}
