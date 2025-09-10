using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string Endereco { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string? NumeroIdentificacao { get; set; }
        public int CentroId { get; set; }
        public string CentroNome { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public DateTime DataRegisto { get; set; }
        public DateTime? DataUltimoPagamento { get; set; }
        public string? ContactoEmergenciaNome { get; set; }
        public string? ContactoEmergenciaTelefone { get; set; }
        public string? ContactoEmergenciaRelacao { get; set; }
        public string? Observacoes { get; set; }
        public string? RegistadoPorNome { get; set; }
        public decimal TotalPago { get; set; }
        public decimal TotalDevido { get; set; }
        public string StatusPagamento { get; set; } = string.Empty;
    }

    public class CreateMemberDto
    {
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Telefone { get; set; }

        [Required]
        [StringLength(300)]
        public string Endereco { get; set; } = string.Empty;

        [Required]
        public DateTime DataNascimento { get; set; }

        [StringLength(20)]
        public string? NumeroIdentificacao { get; set; }

        [Required]
        public int CentroId { get; set; }

        [StringLength(100)]
        public string? ContactoEmergenciaNome { get; set; }

        [StringLength(20)]
        public string? ContactoEmergenciaTelefone { get; set; }

        [StringLength(100)]
        public string? ContactoEmergenciaRelacao { get; set; }

        [StringLength(500)]
        public string? Observacoes { get; set; }
    }

    public class UpdateMemberDto : CreateMemberDto
    {
        public bool Activo { get; set; } = true;
    }
}
