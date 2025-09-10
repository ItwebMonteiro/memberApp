using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.DTOs;
using MemberManagementAPI.Helpers;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _jwtHelper = new JwtHelper(configuration);
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .Include(u => u.Centro)
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Activo);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return null;

            await UpdateLastLoginAsync(user.Id);

            var token = _jwtHelper.GenerateToken(user.Id.ToString(), user.Email, user.Role);

            return new AuthResponseDto
            {
                Token = token,
                User = MapToUserDto(user)
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return null;

            var user = new User
            {
                Nome = request.Nome,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                CentroId = request.CentroId,
                Activo = true,
                DataCriacao = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Reload with Centro
            user = await _context.Users
                .Include(u => u.Centro)
                .FirstAsync(u => u.Id == user.Id);

            var token = _jwtHelper.GenerateToken(user.Id.ToString(), user.Email, user.Role);

            return new AuthResponseDto
            {
                Token = token,
                User = MapToUserDto(user)
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Centro)
                .FirstOrDefaultAsync(u => u.Id == userId && u.Activo);

            return user != null ? MapToUserDto(user) : null;
        }

        public async Task<bool> UpdateLastLoginAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.UltimoLogin = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Nome = user.Nome,
                Email = user.Email,
                Role = user.Role,
                CentroId = user.CentroId,
                CentroNome = user.Centro?.Nome,
                Activo = user.Activo,
                DataCriacao = user.DataCriacao,
                UltimoLogin = user.UltimoLogin
            };
        }
    }
}
