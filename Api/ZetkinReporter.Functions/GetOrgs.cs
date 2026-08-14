using Microsoft.Azure.Functions.Worker;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZetkinReporter.Core;
using ZetkinReporter.Core.Services;

namespace ZetkinReporter.Functions;

public class GetOrgs(IZetkinService zetkinService)
{
    [Function("GetOrgs")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        var cookie = req.Query["cookie"].ToString();

        try
        {
            return string.IsNullOrEmpty(cookie) ? 
                new OkObjectResult(MockData.Organisations()) : 
                new OkObjectResult(await zetkinService.GetOrgs(cookie));
        }
        catch (HttpRequestException exception)
        {
            return new BadRequestObjectResult(exception.Message);
        }
    }
}