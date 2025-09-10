using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MemberManagementAPI.DTOs;
using MemberManagementAPI.Services;
using System.Security.Claims;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            
            if (result == null)
                return Unauthorized(new { message = "Email ou palavra-passe incorrectos" });

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            
            if (result == null)
                return BadRequest(new { message = "Email já está em uso" });

            return Ok(result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userId);
            
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost("refresh")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> RefreshToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userId);
            
            if (user == null)
                return Unauthorized();

            // Generate new token
            var jwtHelper = new MemberManagementAPI.Helpers.JwtHelper(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            var token = jwtHelper.GenerateToken(user.Id.ToString(), user.Email, user.Role);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = user
            });
        }
    }
}
