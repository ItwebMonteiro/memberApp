using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("generate")]
        public async Task<ActionResult<object>> GenerateReport(GenerateReportDto dto)
        {
            var report = new Models.Report
            {
                Nome = dto.Nome,
                Tipo = dto.Tipo,
                Parametros = System.Text.Json.JsonSerializer.Serialize(dto.Parametros),
                DataGeracao = DateTime.UtcNow,
                Status = "Gerado"
            };

            // Gerar dados do relatório baseado no tipo
            var dados = await GenerateReportData(dto.Tipo, dto.Parametros);
            report.Dados = System.Text.Json.JsonSerializer.Serialize(dados);

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = report.Id,
                nome = report.Nome,
                tipo = report.Tipo,
                dataGeracao = report.DataGeracao,
                dados = dados
            });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetReports()
        {
            var reports = await _context.Reports
                .OrderByDescending(r => r.DataGeracao)
                .Select(r => new
                {
                    id = r.Id,
                    nome = r.Nome,
                    tipo = r.Tipo,
                    dataGeracao = r.DataGeracao,
                    status = r.Status
                })
                .ToListAsync();

            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetReport(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null)
                return NotFound();

            var dados = System.Text.Json.JsonSerializer.Deserialize<object>(report.Dados ?? "{}");

            return Ok(new
            {
                id = report.Id,
                nome = report.Nome,
                tipo = report.Tipo,
                dataGeracao = report.DataGeracao,
                dados = dados
            });
        }

        private async Task<object> GenerateReportData(string tipo, Dictionary<string, object> parametros)
        {
            return tipo switch
            {
                "Membros por Centro" => await GenerateMembersByCenterReport(parametros),
                "Pagamentos por Período" => await GeneratePaymentsByPeriodReport(parametros),
                "Inadimplência" => await GenerateDefaultersReport(parametros),
                "Financeiro Mensal" => await GenerateMonthlyFinancialReport(parametros),
                _ => new { erro = "Tipo de relatório não suportado" }
            };
        }

        private async Task<object> GenerateMembersByCenterReport(Dictionary<string, object> parametros)
        {
            var membersByCenter = await _context.Members
                .Include(m => m.Center)
                .GroupBy(m => m.Center.Nome)
                .Select(g => new
                {
                    centro = g.Key,
                    totalMembros = g.Count(),
                    membrosActivos = g.Count(m => m.Status == "Activo"),
                    membrosInactivos = g.Count(m => m.Status == "Inactivo")
                })
                .ToListAsync();

            return new
            {
                titulo = "Membros por Centro",
                dados = membersByCenter,
                total = membersByCenter.Sum(x => x.totalMembros)
            };
        }

        private async Task<object> GeneratePaymentsByPeriodReport(Dictionary<string, object> parametros)
        {
            var startDate = parametros.ContainsKey("dataInicio") ? 
                DateTime.Parse(parametros["dataInicio"].ToString()!) : 
                DateTime.Now.AddMonths(-1);
            
            var endDate = parametros.ContainsKey("dataFim") ? 
                DateTime.Parse(parametros["dataFim"].ToString()!) : 
                DateTime.Now;

            var payments = await _context.Payments
                .Include(p => p.Member)
                .ThenInclude(m => m.Center)
                .Where(p => p.DataPagamento >= startDate && p.DataPagamento <= endDate)
                .GroupBy(p => p.Member.Center.Nome)
                .Select(g => new
                {
                    centro = g.Key,
                    totalPagamentos = g.Count(),
                    valorTotal = g.Sum(p => p.Valor),
                    pagamentosPagos = g.Count(p => p.Status == "Pago"),
                    pagamentosPendentes = g.Count(p => p.Status == "Pendente")
                })
                .ToListAsync();

            return new
            {
                titulo = "Pagamentos por Período",
                periodo = new { inicio = startDate, fim = endDate },
                dados = payments,
                resumo = new
                {
                    totalPagamentos = payments.Sum(x => x.totalPagamentos),
                    valorTotal = payments.Sum(x => x.valorTotal)
                }
            };
        }

        private async Task<object> GenerateDefaultersReport(Dictionary<string, object> parametros)
        {
            var cutoffDate = DateTime.Now.AddDays(-30); // Considerar inadimplente após 30 dias

            var defaulters = await _context.Members
                .Include(m => m.Center)
                .Where(m => m.Status == "Activo" && 
                           (m.DataUltimoPagamento == null || m.DataUltimoPagamento < cutoffDate))
                .Select(m => new
                {
                    id = m.Id,
                    nome = m.Nome,
                    email = m.Email,
                    telefone = m.Telefone,
                    centro = m.Center.Nome,
                    valorMensalidade = m.ValorMensalidade,
                    ultimoPagamento = m.DataUltimoPagamento,
                    diasAtraso = m.DataUltimoPagamento.HasValue ? 
                        (DateTime.Now - m.DataUltimoPagamento.Value).Days : 
                        (DateTime.Now - m.DataRegisto).Days
                })
                .OrderByDescending(m => m.diasAtraso)
                .ToListAsync();

            return new
            {
                titulo = "Relatório de Inadimplência",
                dados = defaulters,
                resumo = new
                {
                    totalInadimplentes = defaulters.Count,
                    valorTotal = defaulters.Sum(x => x.valorMensalidade)
                }
            };
        }

        private async Task<object> GenerateMonthlyFinancialReport(Dictionary<string, object> parametros)
        {
            var month = parametros.ContainsKey("mes") ? 
                int.Parse(parametros["mes"].ToString()!) : 
                DateTime.Now.Month;
            
            var year = parametros.ContainsKey("ano") ? 
                int.Parse(parametros["ano"].ToString()!) : 
                DateTime.Now.Year;

            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var payments = await _context.Payments
                .Include(p => p.Member)
                .ThenInclude(m => m.Center)
                .Where(p => p.DataPagamento >= startDate && p.DataPagamento <= endDate && p.Status == "Pago")
                .ToListAsync();

            var byCenter = payments
                .GroupBy(p => p.Member.Center.Nome)
                .Select(g => new
                {
                    centro = g.Key,
                    receita = g.Sum(p => p.Valor),
                    pagamentos = g.Count()
                })
                .ToList();

            var byMethod = payments
                .GroupBy(p => p.MetodoPagamento)
                .Select(g => new
                {
                    metodo = g.Key,
                    receita = g.Sum(p => p.Valor),
                    pagamentos = g.Count()
                })
                .ToList();

            return new
            {
                titulo = "Relatório Financeiro Mensal",
                periodo = new { mes = month, ano = year },
                resumo = new
                {
                    receitaTotal = payments.Sum(p => p.Valor),
                    totalPagamentos = payments.Count
                },
                porCentro = byCenter,
                porMetodoPagamento = byMethod
            };
        }
    }

    public class GenerateReportDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public Dictionary<string, object> Parametros { get; set; } = new();
    }
}
