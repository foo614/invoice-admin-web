using invoice_admin_web.Middleware;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React development server
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register IHttpClientFactory
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Serve React static files in production
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/dist")),
    RequestPath = string.Empty
});

app.UseRouting();

// Apply the CORS policy
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// Proxy React development server in development mode
if (app.Environment.IsDevelopment())
{
    app.UseMiddleware<ProxyToReactDevelopmentServerMiddleware>("http://localhost:8000");
}

// Fallback to index.html for React routing in production
if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

app.Run();
