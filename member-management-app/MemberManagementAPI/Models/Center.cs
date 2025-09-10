using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models
{
    public class Center
    {
        [Key]
        public int Id { get; set; }

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

        public bool Activo { get; set; } = true;

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string? Responsavel { get; set; }

        public decimal ValorMensalidade { get; set; } = 0;

        // Navigation properties
        public virtual ICollection<Member> Membros { get; set; } = new List<Member>();
        public virtual ICollection<User> Utilizadores { get; set; } = new List<User>();
    }
}
