using ZetkinReporter.Api.Models.Results;

namespace ZetkinReporter.Api.Services;

public interface IZetkinService
{
    Task<IEnumerable<OrgsResult>> GetOrgs(string cookie);
    Task<IEnumerable<ActionsResult>> GetAllActions(int orgId, string cookie, int dateRangeMonths);
}