using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;
using MemberManagementAPI.DTOs;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMembers(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] int? centroId = null)
        {
            var query = _context.Members
                .Include(m => m.Center)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => m.Nome.Contains(search) || 
                                       m.Email.Contains(search) ||
                                       m.Telefone.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(m => m.Status == status);
            }

            if (centroId.HasValue)
            {
                query = query.Where(m => m.CentroId == centroId.Value);
            }

            var members = await query
                .Select(m => new
                {
                    id = m.Id,
                    nome = m.Nome,
                    email = m.Email,
                    telefone = m.Telefone,
                    dataNascimento = m.DataNascimento,
                    morada = m.Morada,
                    status = m.Status,
                    centroId = m.CentroId,
                    centroNome = m.Center.Nome,
                    dataRegisto = m.DataRegisto,
                    dataUltimoPagamento = m.DataUltimoPagamento,
                    valorMensalidade = m.ValorMensalidade,
                    contactoEmergencia = new
                    {
                        nome = m.ContactoEmergenciaNome,
                        telefone = m.ContactoEmergenciaTelefone,
                        relacao = m.ContactoEmergenciaRelacao
                    }
                })
                .ToListAsync();

            return Ok(members);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetMember(int id)
        {
            var member = await _context.Members
                .Include(m => m.Center)
                .Where(m => m.Id == id)
                .Select(m => new
                {
                    id = m.Id,
                    nome = m.Nome,
                    email = m.Email,
                    telefone = m.Telefone,
                    dataNascimento = m.DataNascimento,
                    morada = m.Morada,
                    status = m.Status,
                    centroId = m.CentroId,
                    centroNome = m.Center.Nome,
                    dataRegisto = m.DataRegisto,
                    dataUltimoPagamento = m.DataUltimoPagamento,
                    valorMensalidade = m.ValorMensalidade,
                    contactoEmergencia = new
                    {
                        nome = m.ContactoEmergenciaNome,
                        telefone = m.ContactoEmergenciaTelefone,
                        relacao = m.ContactoEmergenciaRelacao
                    }
                })
                .FirstOrDefaultAsync();

            if (member == null)
                return NotFound();

            return Ok(member);
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateMember(CreateMemberDto dto)
        {
            // Verificar se o centro existe
            var center = await _context.Centers.FindAsync(dto.CentroId);
            if (center == null)
                return BadRequest("Centro não encontrado");

            // Verificar se já existe membro com o mesmo email
            if (await _context.Members.AnyAsync(m => m.Email == dto.Email))
                return BadRequest("Já existe um membro com este email");

            var member = new Member
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Telefone = dto.Telefone,
                DataNascimento = dto.DataNascimento,
                Morada = dto.Morada,
                Status = dto.Status ?? "Activo",
                CentroId = dto.CentroId,
                ValorMensalidade = dto.ValorMensalidade,
                ContactoEmergenciaNome = dto.ContactoEmergencia?.Nome,
                ContactoEmergenciaTelefone = dto.ContactoEmergencia?.Telefone,
                ContactoEmergenciaRelacao = dto.ContactoEmergencia?.Relacao,
                DataRegisto = DateTime.UtcNow
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, new { id = member.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, UpdateMemberDto dto)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return NotFound();

            // Verificar se o centro existe
            if (dto.CentroId.HasValue)
            {
                var center = await _context.Centers.FindAsync(dto.CentroId.Value);
                if (center == null)
                    return BadRequest("Centro não encontrado");
                member.CentroId = dto.CentroId.Value;
            }

            // Verificar se já existe outro membro com o mesmo email
            if (!string.IsNullOrEmpty(dto.Email) && dto.Email != member.Email)
            {
                if (await _context.Members.AnyAsync(m => m.Email == dto.Email && m.Id != id))
                    return BadRequest("Já existe um membro com este email");
                member.Email = dto.Email;
            }

            if (!string.IsNullOrEmpty(dto.Nome)) member.Nome = dto.Nome;
            if (!string.IsNullOrEmpty(dto.Telefone)) member.Telefone = dto.Telefone;
            if (dto.DataNascimento.HasValue) member.DataNascimento = dto.DataNascimento.Value;
            if (!string.IsNullOrEmpty(dto.Morada)) member.Morada = dto.Morada;
            if (!string.IsNullOrEmpty(dto.Status)) member.Status = dto.Status;
            if (dto.ValorMensalidade.HasValue) member.ValorMensalidade = dto.ValorMensalidade.Value;

            if (dto.ContactoEmergencia != null)
            {
                member.ContactoEmergenciaNome = dto.ContactoEmergencia.Nome;
                member.ContactoEmergenciaTelefone = dto.ContactoEmergencia.Telefone;
                member.ContactoEmergenciaRelacao = dto.ContactoEmergencia.Relacao;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return NotFound();

            // Verificar se o membro tem pagamentos associados
            var hasPayments = await _context.Payments.AnyAsync(p => p.MembroId == id);
            if (hasPayments)
                return BadRequest("Não é possível eliminar um membro com pagamentos associados");

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            var totalMembers = await _context.Members.CountAsync();
            var activeMembers = await _context.Members.CountAsync(m => m.Status == "Activo");
            var inactiveMembers = await _context.Members.CountAsync(m => m.Status == "Inactivo");

            return Ok(new
            {
                total = totalMembers,
                activos = activeMembers,
                inactivos = inactiveMembers
            });
        }
    }
}
