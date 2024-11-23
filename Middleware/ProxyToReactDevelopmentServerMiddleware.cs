using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace invoice_admin_web.Middleware
{
    public class ProxyToReactDevelopmentServerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _developmentServerUri;

        public ProxyToReactDevelopmentServerMiddleware(RequestDelegate next, string developmentServerUri)
        {
            _next = next;
            _developmentServerUri = developmentServerUri;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Pass through API requests
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                await _next(context);
                return;
            }

            // Proxy to React development server
            using var client = new HttpClient();
            var targetUri = $"{_developmentServerUri}{context.Request.Path}{context.Request.QueryString}";

            try
            {
                var response = await client.GetAsync(targetUri);
                context.Response.StatusCode = (int)response.StatusCode;

                foreach (var header in response.Headers)
                {
                    if (!context.Response.Headers.ContainsKey(header.Key))
                    {
                        context.Response.Headers[header.Key] = string.Join(",", header.Value);
                    }
                }

                var responseContent = await response.Content.ReadAsStreamAsync();
                await responseContent.CopyToAsync(context.Response.Body);
            }
            catch (HttpRequestException ex)
            {
                context.Response.StatusCode = 502; // Bad Gateway
                await context.Response.WriteAsync($"Failed to connect to the React development server: {ex.Message}");
            }
        }
    }
}
