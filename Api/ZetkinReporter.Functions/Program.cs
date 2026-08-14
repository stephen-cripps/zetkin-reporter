using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ZetkinReporter.Core.Services;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services.AddTransient<IZetkinService, ZetkinService>();

builder.Services.AddHttpClient();

builder.Build().Run();