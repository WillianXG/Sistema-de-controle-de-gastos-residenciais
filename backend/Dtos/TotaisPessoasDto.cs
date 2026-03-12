namespace ControleGastos.Api.Dtos
{
    public class TotaisPessoasDto
    {
        public List<PessoaResumoDto> Pessoas { get; set; } = new();
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal SaldoTotal { get; set; }

    }
}
