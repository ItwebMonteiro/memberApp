using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetNotifications()
        {
            var notifications = await _context.Notifications
                .OrderByDescending(n => n.DataEnvio)
                .Select(n => new
                {
                    id = n.Id,
                    tipo = n.Tipo,
                    destinatario = n.Destinatario,
                    assunto = n.Assunto,
                    mensagem = n.Mensagem,
                    dataEnvio = n.DataEnvio,
                    status = n.Status
                })
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPost("send")]
        public async Task<ActionResult<object>> SendNotification(SendNotificationDto dto)
        {
            var notification = new Notification
            {
                Tipo = dto.Tipo,
                Destinatario = dto.Destinatario,
                Assunto = dto.Assunto,
                Mensagem = dto.Mensagem,
                DataEnvio = DateTime.UtcNow,
                Status = "Enviado" // Simular envio bem-sucedido
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Aqui seria implementada a lógica real de envio de SMS/Email
            // Por agora, apenas simulamos o envio

            return Ok(new { id = notification.Id, status = "Enviado" });
        }

        [HttpPost("send-bulk")]
        public async Task<ActionResult<object>> SendBulkNotification(SendBulkNotificationDto dto)
        {
            var notifications = new List<Notification>();

            foreach (var destinatario in dto.Destinatarios)
            {
                var notification = new Notification
                {
                    Tipo = dto.Tipo,
                    Destinatario = destinatario,
                    Assunto = dto.Assunto,
                    Mensagem = dto.Mensagem,
                    DataEnvio = DateTime.UtcNow,
                    Status = "Enviado"
                };

                notifications.Add(notification);
            }

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { 
                totalEnviados = notifications.Count,
                status = "Enviado"
            });
        }

        [HttpGet("templates")]
        public ActionResult<IEnumerable<object>> GetTemplates()
        {
            var templates = new[]
            {
                new { id = 1, nome = "Lembrete de Pagamento", tipo = "Email", assunto = "Lembrete: Mensalidade em Atraso", mensagem = "Caro {nome}, a sua mensalidade está em atraso. Por favor, regularize a situação." },
                new { id = 2, nome = "Boas-vindas", tipo = "Email", assunto = "Bem-vindo ao {centro}", mensagem = "Caro {nome}, bem-vindo ao nosso centro. Estamos felizes em tê-lo connosco." },
                new { id = 3, nome = "SMS Pagamento", tipo = "SMS", assunto = "", mensagem = "Olá {nome}, a sua mensalidade de {valor}Kz está em atraso. Regularize até {data}." }
            };

            return Ok(templates);
        }
    }

    public class SendNotificationDto
    {
        public string Tipo { get; set; } = string.Empty; // Email ou SMS
        public string Destinatario { get; set; } = string.Empty;
        public string Assunto { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
    }

    public class SendBulkNotificationDto
    {
        public string Tipo { get; set; } = string.Empty;
        public List<string> Destinatarios { get; set; } = new();
        public string Assunto { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;
    }
}
