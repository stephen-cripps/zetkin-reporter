var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

// Allow CORS for all origins (for development purposes)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = configuration["AllowedOrigins"]?.Split(',') ?? [];
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
if (!builder.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();
app.MapControllers();
app.Run();