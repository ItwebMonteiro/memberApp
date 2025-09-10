using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MembroId { get; set; }

        [ForeignKey("MembroId")]
        public virtual Member Membro { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataPagamento { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        [Required]
        [StringLength(50)]
        public string MetodoPagamento { get; set; } = string.Empty; // PIX, Cartão, Dinheiro, Transferência

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pendente"; // Pago, Pendente, Atrasado, Cancelado

        [StringLength(50)]
        public string TipoPagamento { get; set; } = "Mensalidade"; // Mensalidade, Taxa, Multa

        [StringLength(500)]
        public string? Observacoes { get; set; }

        [StringLength(100)]
        public string? NumeroTransacao { get; set; }

        public int? RegistadoPorId { get; set; }

        [ForeignKey("RegistadoPorId")]
        public virtual User? RegistadoPor { get; set; }

        public DateTime DataRegisto { get; set; } = DateTime.Now;

        // Para controlo de mensalidades
        public int MesReferencia { get; set; }
        public int AnoReferencia { get; set; }
    }
}
