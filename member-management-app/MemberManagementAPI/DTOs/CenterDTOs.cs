using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.DTOs
{
    public class CenterDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string Endereco { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public bool Activo { get; set; }
        public DateTime DataCriacao { get; set; }
        public string? Responsavel { get; set; }
        public decimal ValorMensalidade { get; set; }
        public int TotalMembros { get; set; }
        public int MembrosActivos { get; set; }
    }

    public class CreateCenterDto
    {
        [Required]
        [StringLength(200)]
        public string Nome { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Descricao { get; set; }

        [Required]
        [StringLength(300)]
        public string Endereco { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Telefone { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? Responsavel { get; set; }

        [Range(0, double.MaxValue)]
        public decimal ValorMensalidade { get; set; } = 0;
    }

    public class UpdateCenterDto : CreateCenterDto
    {
        public bool Activo { get; set; } = true;
    }
}
