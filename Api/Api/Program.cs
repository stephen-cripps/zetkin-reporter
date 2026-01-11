var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

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