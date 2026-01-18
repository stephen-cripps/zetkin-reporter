using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZetkinReporter.Api.Services;

namespace ZetkinReporter.Api;

public class GetActions(IZetkinService zetkinService)
{
    [Function("GetActions")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        if(!int.TryParse(req.Query["orgId"].ToString(), out var orgId))
            return new BadRequestObjectResult("orgId is required and must be an integer.");
        
        if(!int.TryParse(req.Query["dateRangeMonths"].ToString(), out var dateRangeMonths))
            dateRangeMonths = 3;
        
        var cookie = req.Query["cookie"].ToString();

        if(string.IsNullOrEmpty(cookie))
            return new OkObjectResult(MockData.Actions(orgId, dateRangeMonths));

        try
        {
            return new OkObjectResult(zetkinService.GetAllActions(orgId, cookie, dateRangeMonths));
        }
        catch (HttpRequestException exception)
        {
            return new BadRequestObjectResult(exception.Message);
        }
    }
}