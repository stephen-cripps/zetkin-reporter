using Microsoft.AspNetCore.Mvc;
using ZetkinReporter.Core;
using ZetkinReporter.Core.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddTransient<IZetkinService, ZetkinService>();
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        // ToDo: Set via config
        policy
            .WithOrigins("https://stephen-cripps.github.io/zetkin-reporter")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment()) { app.MapOpenApi(); }

// No need for this as cloudfare will handle the https stuff. Leaving here as a note to self as I'll inevitably forget this. 
// app.UseHttpsRedirection();

app.UseCors("Frontend");

var zetkinService = app.Services.GetRequiredService<IZetkinService>();

app.MapGet("api/GetOrgs", async ([FromQuery] string cookie) =>
{
    try
    {
        var data = string.IsNullOrEmpty(cookie)
            ? MockData.Organisations()
            : await zetkinService.GetOrgs(cookie);

        return Results.Ok(data);
    }
    catch (HttpRequestException ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

app.MapGet("api/GetActions",
    async ([FromQuery] int orgId, [FromQuery] int dateRangeMonths, [FromQuery] string cookie) =>
    {
        if (orgId == 0)
            return Results.BadRequest("orgId is required");

        if (dateRangeMonths <= 0)
            dateRangeMonths = 3;

        if (string.IsNullOrEmpty(cookie))
            return Results.Ok(MockData.Actions(orgId, dateRangeMonths));

        try
        {
            return Results.Ok(await zetkinService.GetAllActions(orgId, cookie, dateRangeMonths));
        }
        catch (HttpRequestException exception)
        {
            return Results.BadRequest(exception.Message);
        }
    });

app.Run();