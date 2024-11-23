using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

namespace invoice_admin_web.Controllers
{
    [Route("api")]
    [ApiController]
    public class GenericController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public GenericController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _baseUrl = configuration["BaseUrl"] ?? throw new ArgumentNullException("BaseUrl is not configured in appsettings.json");
        }

        // Dynamic GET method
        [HttpGet("{*path}")]
        public async Task<IActionResult> DynamicGet(string path, [FromQuery] Dictionary<string, string> queryParams)
        {
            // Build the target URL
            var queryString = string.Join("&", queryParams.Select(q => $"{q.Key}={q.Value}"));
            var targetUrl = $"{_baseUrl}/{path}?{queryString}";

            try
            {
                var response = await _httpClient.GetAsync(targetUrl);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Content(result, response.Content.Headers.ContentType?.ToString() ?? "application/json");
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error forwarding GET request: {ex.Message}");
            }
        }

        // Dynamic POST method
        [HttpPost("{*path}")]
        public async Task<IActionResult> DynamicPost(string path, [FromBody] JsonElement requestBody)
        {
            // Build the target URL
            var targetUrl = $"{_baseUrl}/{path}";

            try
            {
                var content = new StringContent(requestBody.GetRawText(), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(targetUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Content(result, response.Content.Headers.ContentType?.ToString() ?? "application/json");
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error forwarding POST request: {ex.Message}");
            }
        }
    }
}
