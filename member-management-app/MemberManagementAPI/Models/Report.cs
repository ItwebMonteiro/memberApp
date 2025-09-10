using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Report
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Tipo { get; set; } = string.Empty; // Membros, Pagamentos, Financeiro, Geral

        [StringLength(500)]
        public string? Descricao { get; set; }

        public string Parametros { get; set; } = string.Empty; // JSON com parâmetros do relatório

        public DateTime DataGeracao { get; set; } = DateTime.Now;

        public int? CentroId { get; set; }

        [ForeignKey("CentroId")]
        public virtual Center? Centro { get; set; }

        public int GeradoPorId { get; set; }

        [ForeignKey("GeradoPorId")]
        public virtual User GeradoPor { get; set; } = null!;

        [StringLength(50)]
        public string Formato { get; set; } = "PDF"; // PDF, Excel, CSV

        [StringLength(500)]
        public string? CaminhoArquivo { get; set; }

        public long? TamanhoArquivo { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Gerado"; // Gerado, Processando, Erro
    }
}
