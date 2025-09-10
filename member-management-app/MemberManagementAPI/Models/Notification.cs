using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        public string Mensagem { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Tipo { get; set; } = string.Empty; // SMS, Email, Ambos

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pendente"; // Enviado, Pendente, Falhado

        public DateTime DataEnvio { get; set; } = DateTime.Now;

        public DateTime? DataEntrega { get; set; }

        [StringLength(500)]
        public string? Destinatarios { get; set; } // JSON com lista de destinatários

        public int? MembroId { get; set; }

        [ForeignKey("MembroId")]
        public virtual Member? Membro { get; set; }

        public int? CentroId { get; set; }

        [ForeignKey("CentroId")]
        public virtual Center? Centro { get; set; }

        public int? EnviadoPorId { get; set; }

        [ForeignKey("EnviadoPorId")]
        public virtual User? EnviadoPor { get; set; }

        [StringLength(1000)]
        public string? ErroMensagem { get; set; }

        public int TentativasEnvio { get; set; } = 0;
    }
}
