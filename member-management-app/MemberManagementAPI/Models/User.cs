using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class User
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

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "Utilizador"; // Admin, Gerente, Utilizador

        public int? CentroId { get; set; }

        [ForeignKey("CentroId")]
        public virtual Center? Centro { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public DateTime? UltimoLogin { get; set; }

        // Navigation properties
        public virtual ICollection<Member> MembrosGeridos { get; set; } = new List<Member>();
        public virtual ICollection<Payment> PagamentosRegistados { get; set; } = new List<Payment>();
        public virtual ICollection<Notification> NotificacoesEnviadas { get; set; } = new List<Notification>();
    }
}
