using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Member
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Telefone { get; set; }

        [Required]
        [StringLength(300)]
        public string Endereco { get; set; } = string.Empty;

        public DateTime DataNascimento { get; set; }

        [StringLength(20)]
        public string? NumeroIdentificacao { get; set; }

        [Required]
        public int CentroId { get; set; }

        [ForeignKey("CentroId")]
        public virtual Center Centro { get; set; } = null!;

        public bool Activo { get; set; } = true;

        public DateTime DataRegisto { get; set; } = DateTime.Now;

        public DateTime? DataUltimoPagamento { get; set; }

        // Contacto de emergência
        [StringLength(100)]
        public string? ContactoEmergenciaNome { get; set; }

        [StringLength(20)]
        public string? ContactoEmergenciaTelefone { get; set; }

        [StringLength(100)]
        public string? ContactoEmergenciaRelacao { get; set; }

        // Informações adicionais
        [StringLength(500)]
        public string? Observacoes { get; set; }

        public int? RegistadoPorId { get; set; }

        [ForeignKey("RegistadoPorId")]
        public virtual User? RegistadoPor { get; set; }

        // Navigation properties
        public virtual ICollection<Payment> Pagamentos { get; set; } = new List<Payment>();
    }
}
