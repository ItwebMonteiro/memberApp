using MemberManagementAPI.DTOs;

namespace MemberManagementAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<bool> UpdateLastLoginAsync(int userId);
    }
}
