using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZetkinReporter.Api.Services;

namespace ZetkinReporter.Api;

public class GetOrgs(IZetkinService zetkinService)
{
    [Function("GetOrgs")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
    {
        var cookie = req.Query["cookie"].ToString();

        // ToDO: fix error handling to return meaningful error messages
        return string.IsNullOrEmpty(cookie) ? 
            new OkObjectResult(MockData.Organisations()) : 
            new OkObjectResult(await zetkinService.GetOrgs(cookie));
    }
}