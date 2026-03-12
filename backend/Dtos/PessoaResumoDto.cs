namespace ControleGastos.Api.Dtos
{
    public class PessoaResumoDto
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }

    }
}
