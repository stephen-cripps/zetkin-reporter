using ZetkinReporter.Core.Models.Results;

namespace ZetkinReporter.Core.Services;

public interface IZetkinService
{
    Task<IEnumerable<OrgsResult>> GetOrgs(string cookie);
    Task<IEnumerable<ActionsResult>> GetAllActions(int orgId, string cookie, int dateRangeMonths);
}