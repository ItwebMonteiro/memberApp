using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.DTOs;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CentersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CentersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CenterDto>>> GetCenters([FromQuery] string? search, [FromQuery] bool? activo)
        {
            var query = _context.Centers.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Nome.Contains(search) || 
                                        c.Endereco.Contains(search) ||
                                        (c.Responsavel != null && c.Responsavel.Contains(search)));
            }

            if (activo.HasValue)
            {
                query = query.Where(c => c.Activo == activo.Value);
            }

            var centers = await query
                .Select(c => new CenterDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Descricao = c.Descricao,
                    Endereco = c.Endereco,
                    Telefone = c.Telefone,
                    Email = c.Email,
                    Activo = c.Activo,
                    DataCriacao = c.DataCriacao,
                    Responsavel = c.Responsavel,
                    ValorMensalidade = c.ValorMensalidade,
                    TotalMembros = c.Membros.Count(),
                    MembrosActivos = c.Membros.Count(m => m.Activo)
                })
                .OrderBy(c => c.Nome)
                .ToListAsync();

            return Ok(centers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CenterDto>> GetCenter(int id)
        {
            var center = await _context.Centers
                .Where(c => c.Id == id)
                .Select(c => new CenterDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Descricao = c.Descricao,
                    Endereco = c.Endereco,
                    Telefone = c.Telefone,
                    Email = c.Email,
                    Activo = c.Activo,
                    DataCriacao = c.DataCriacao,
                    Responsavel = c.Responsavel,
                    ValorMensalidade = c.ValorMensalidade,
                    TotalMembros = c.Membros.Count(),
                    MembrosActivos = c.Membros.Count(m => m.Activo)
                })
                .FirstOrDefaultAsync();

            if (center == null)
                return NotFound();

            return Ok(center);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Gerente")]
        public async Task<ActionResult<CenterDto>> CreateCenter([FromBody] CreateCenterDto dto)
        {
            var center = new Center
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                Endereco = dto.Endereco,
                Telefone = dto.Telefone,
                Email = dto.Email,
                Responsavel = dto.Responsavel,
                ValorMensalidade = dto.ValorMensalidade,
                Activo = true,
                DataCriacao = DateTime.Now
            };

            _context.Centers.Add(center);
            await _context.SaveChangesAsync();

            var result = new CenterDto
            {
                Id = center.Id,
                Nome = center.Nome,
                Descricao = center.Descricao,
                Endereco = center.Endereco,
                Telefone = center.Telefone,
                Email = center.Email,
                Activo = center.Activo,
                DataCriacao = center.DataCriacao,
                Responsavel = center.Responsavel,
                ValorMensalidade = center.ValorMensalidade,
                TotalMembros = 0,
                MembrosActivos = 0
            };

            return CreatedAtAction(nameof(GetCenter), new { id = center.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Gerente")]
        public async Task<IActionResult> UpdateCenter(int id, [FromBody] UpdateCenterDto dto)
        {
            var center = await _context.Centers.FindAsync(id);
            
            if (center == null)
                return NotFound();

            center.Nome = dto.Nome;
            center.Descricao = dto.Descricao;
            center.Endereco = dto.Endereco;
            center.Telefone = dto.Telefone;
            center.Email = dto.Email;
            center.Responsavel = dto.Responsavel;
            center.ValorMensalidade = dto.ValorMensalidade;
            center.Activo = dto.Activo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCenter(int id)
        {
            var center = await _context.Centers
                .Include(c => c.Membros)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (center == null)
                return NotFound();

            if (center.Membros.Any())
                return BadRequest(new { message = "Não é possível eliminar um centro com membros associados" });

            _context.Centers.Remove(center);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
