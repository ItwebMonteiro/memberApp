using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Center> Centers { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Report> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações de User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasDefaultValue("Utilizador");
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("GETDATE()");
            });

            // Configurações de Center
            modelBuilder.Entity<Center>(entity =>
            {
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.ValorMensalidade).HasPrecision(10, 2);
            });

            // Configurações de Member
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.NumeroIdentificacao).IsUnique();
                entity.Property(e => e.Activo).HasDefaultValue(true);
                entity.Property(e => e.DataRegisto).HasDefaultValueSql("GETDATE()");
                
                // Relacionamento com Center
                entity.HasOne(m => m.Centro)
                      .WithMany(c => c.Membros)
                      .HasForeignKey(m => m.CentroId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relacionamento com User (quem registou)
                entity.HasOne(m => m.RegistadoPor)
                      .WithMany(u => u.MembrosGeridos)
                      .HasForeignKey(m => m.RegistadoPorId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configurações de Payment
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(e => e.Valor).HasPrecision(10, 2);
                entity.Property(e => e.Status).HasDefaultValue("Pendente");
                entity.Property(e => e.DataRegisto).HasDefaultValueSql("GETDATE()");
                
                // Relacionamento com Member
                entity.HasOne(p => p.Membro)
                      .WithMany(m => m.Pagamentos)
                      .HasForeignKey(p => p.MembroId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relacionamento com User (quem registou)
                entity.HasOne(p => p.RegistadoPor)
                      .WithMany(u => u.PagamentosRegistados)
                      .HasForeignKey(p => p.RegistadoPorId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configurações de Notification
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Status).HasDefaultValue("Pendente");
                entity.Property(e => e.DataEnvio).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.TentativasEnvio).HasDefaultValue(0);

                // Relacionamentos opcionais
                entity.HasOne(n => n.Membro)
                      .WithMany()
                      .HasForeignKey(n => n.MembroId)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(n => n.Centro)
                      .WithMany()
                      .HasForeignKey(n => n.CentroId)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(n => n.EnviadoPor)
                      .WithMany(u => u.NotificacoesEnviadas)
                      .HasForeignKey(n => n.EnviadoPorId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configurações de Report
            modelBuilder.Entity<Report>(entity =>
            {
                entity.Property(e => e.DataGeracao).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Formato).HasDefaultValue("PDF");
                entity.Property(e => e.Status).HasDefaultValue("Gerado");

                // Relacionamento com Center (opcional)
                entity.HasOne(r => r.Centro)
                      .WithMany()
                      .HasForeignKey(r => r.CentroId)
                      .OnDelete(DeleteBehavior.SetNull);

                // Relacionamento com User (quem gerou)
                entity.HasOne(r => r.GeradoPor)
                      .WithMany()
                      .HasForeignKey(r => r.GeradoPorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Relacionamento User -> Center
            modelBuilder.Entity<User>()
                .HasOne(u => u.Centro)
                .WithMany(c => c.Utilizadores)
                .HasForeignKey(u => u.CentroId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
