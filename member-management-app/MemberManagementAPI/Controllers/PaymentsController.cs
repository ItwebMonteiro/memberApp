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
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPayments(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] int? memberId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Payments
                .Include(p => p.Member)
                .ThenInclude(m => m.Center)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Member.Nome.Contains(search) || 
                                       p.Member.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(p => p.Status == status);
            }

            if (memberId.HasValue)
            {
                query = query.Where(p => p.MembroId == memberId.Value);
            }

            if (startDate.HasValue)
            {
                query = query.Where(p => p.DataPagamento >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(p => p.DataPagamento <= endDate.Value);
            }

            var payments = await query
                .OrderByDescending(p => p.DataPagamento)
                .Select(p => new
                {
                    id = p.Id,
                    membroId = p.MembroId,
                    membroNome = p.Member.Nome,
                    centroNome = p.Member.Center.Nome,
                    valor = p.Valor,
                    dataPagamento = p.DataPagamento,
                    dataVencimento = p.DataVencimento,
                    metodoPagamento = p.MetodoPagamento,
                    status = p.Status,
                    observacoes = p.Observacoes,
                    referencia = p.Referencia
                })
                .ToListAsync();

            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPayment(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Member)
                .ThenInclude(m => m.Center)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    id = p.Id,
                    membroId = p.MembroId,
                    membroNome = p.Member.Nome,
                    centroNome = p.Member.Center.Nome,
                    valor = p.Valor,
                    dataPagamento = p.DataPagamento,
                    dataVencimento = p.DataVencimento,
                    metodoPagamento = p.MetodoPagamento,
                    status = p.Status,
                    observacoes = p.Observacoes,
                    referencia = p.Referencia
                })
                .FirstOrDefaultAsync();

            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreatePayment(CreatePaymentDto dto)
        {
            // Verificar se o membro existe
            var member = await _context.Members.FindAsync(dto.MembroId);
            if (member == null)
                return BadRequest("Membro não encontrado");

            var payment = new Payment
            {
                MembroId = dto.MembroId,
                Valor = dto.Valor,
                DataPagamento = dto.DataPagamento,
                DataVencimento = dto.DataVencimento,
                MetodoPagamento = dto.MetodoPagamento,
                Status = dto.Status ?? "Pago",
                Observacoes = dto.Observacoes,
                Referencia = dto.Referencia ?? Guid.NewGuid().ToString("N")[..8].ToUpper()
            };

            _context.Payments.Add(payment);

            // Actualizar data do último pagamento do membro
            if (payment.Status == "Pago")
            {
                member.DataUltimoPagamento = payment.DataPagamento;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, new { id = payment.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, UpdatePaymentDto dto)
        {
            var payment = await _context.Payments.Include(p => p.Member).FirstOrDefaultAsync(p => p.Id == id);
            if (payment == null)
                return NotFound();

            var oldStatus = payment.Status;

            if (dto.Valor.HasValue) payment.Valor = dto.Valor.Value;
            if (dto.DataPagamento.HasValue) payment.DataPagamento = dto.DataPagamento.Value;
            if (dto.DataVencimento.HasValue) payment.DataVencimento = dto.DataVencimento.Value;
            if (!string.IsNullOrEmpty(dto.MetodoPagamento)) payment.MetodoPagamento = dto.MetodoPagamento;
            if (!string.IsNullOrEmpty(dto.Status)) payment.Status = dto.Status;
            if (dto.Observacoes != null) payment.Observacoes = dto.Observacoes;

            // Actualizar data do último pagamento do membro se necessário
            if (oldStatus != "Pago" && payment.Status == "Pago")
            {
                payment.Member.DataUltimoPagamento = payment.DataPagamento;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("member/{memberId}/statement")]
        public async Task<ActionResult<object>> GetMemberStatement(int memberId)
        {
            var member = await _context.Members
                .Include(m => m.Center)
                .FirstOrDefaultAsync(m => m.Id == memberId);

            if (member == null)
                return NotFound();

            var payments = await _context.Payments
                .Where(p => p.MembroId == memberId)
                .OrderByDescending(p => p.DataPagamento)
                .Select(p => new
                {
                    id = p.Id,
                    valor = p.Valor,
                    dataPagamento = p.DataPagamento,
                    dataVencimento = p.DataVencimento,
                    metodoPagamento = p.MetodoPagamento,
                    status = p.Status,
                    referencia = p.Referencia
                })
                .ToListAsync();

            var totalPago = payments.Where(p => p.status == "Pago").Sum(p => p.valor);
            var totalPendente = payments.Where(p => p.status == "Pendente").Sum(p => p.valor);

            return Ok(new
            {
                membro = new
                {
                    id = member.Id,
                    nome = member.Nome,
                    email = member.Email,
                    centroNome = member.Center.Nome,
                    valorMensalidade = member.ValorMensalidade
                },
                resumo = new
                {
                    totalPago,
                    totalPendente,
                    ultimoPagamento = member.DataUltimoPagamento
                },
                pagamentos = payments
            });
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            var totalPayments = await _context.Payments.CountAsync();
            var paidPayments = await _context.Payments.CountAsync(p => p.Status == "Pago");
            var pendingPayments = await _context.Payments.CountAsync(p => p.Status == "Pendente");
            var totalRevenue = await _context.Payments.Where(p => p.Status == "Pago").SumAsync(p => p.Valor);

            return Ok(new
            {
                totalPagamentos = totalPayments,
                pagamentosPagos = paidPayments,
                pagamentosPendentes = pendingPayments,
                receitaTotal = totalRevenue
            });
        }
    }

    public class CreatePaymentDto
    {
        public int MembroId { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataPagamento { get; set; }
        public DateTime DataVencimento { get; set; }
        public string MetodoPagamento { get; set; } = string.Empty;
        public string? Status { get; set; }
        public string? Observacoes { get; set; }
        public string? Referencia { get; set; }
    }

    public class UpdatePaymentDto
    {
        public decimal? Valor { get; set; }
        public DateTime? DataPagamento { get; set; }
        public DateTime? DataVencimento { get; set; }
        public string? MetodoPagamento { get; set; }
        public string? Status { get; set; }
        public string? Observacoes { get; set; }
    }
}
