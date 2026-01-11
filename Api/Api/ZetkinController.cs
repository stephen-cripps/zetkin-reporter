using System.Net.Http.Headers;
using System.Text.Json;
using Api.Models;
using Api.Models.DTOs;
using Api.Models.Results;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;

namespace Api;

[ApiController]
[Route("api/[controller]")]
public class ZetkinController : ControllerBase
{
    private readonly HttpClient httpClient;

    public ZetkinController(HttpClient httpClient, IConfiguration config)
    {
        this.httpClient = httpClient;
    }

    [HttpGet("orgs")]
    public async Task<IEnumerable<OrgsResult>> GetOrgs(string? cookie)
    {
        // For testing, return mock data
        if(string.IsNullOrWhiteSpace(cookie))
            return MockData.Organisations();
        
        var orgsRequest = new HttpRequestMessage(
            HttpMethod.Get,
            "https://app.zetkin.org/api/orgs"
        );
        
        orgsRequest.Headers.Add("Cookie", cookie);
        var orgsResponse = await httpClient.SendAsync(orgsRequest);
        orgsResponse.EnsureSuccessStatusCode();
        
        var orgsJson = await orgsResponse.Content.ReadAsStringAsync();
        var orgs = JsonSerializer.Deserialize<OrgsResponse>(orgsJson) ?? new OrgsResponse([]);

        return orgs.Data.Select(o => new OrgsResult(o.Id, o.Title ?? "No Name"));
    }
    

    [HttpGet("all-actions")]
    public async Task<IEnumerable<ActionsResult>> GetAllActions(int orgId, string? cookie, int dateRangeMonths = 3)
    {
        // For testing, return mock data
        if(string.IsNullOrWhiteSpace(cookie))
            return MockData.Actions(orgId, dateRangeMonths);
        
        var actions = await GetActions(orgId, cookie);
        
        var filteredActions = actions.Data
            .Where(a => a.StartTime != null && a.StartTime >= DateTime.Now.AddMonths(-dateRangeMonths) && a.StartTime <= DateTime.Now)
            .OrderBy(a => a.StartTime);
        
        var tasks = filteredActions.Select(action => ProcessAction(action, orgId, cookie));
        
        return await Task.WhenAll(tasks); 
    }

    private async Task<ActionsResponse> GetActions(int orgId, string cookie)
    {
        var actionsRequest = new HttpRequestMessage(
            HttpMethod.Get,
            $"https://app.zetkin.org/api/orgs/{orgId}/actions"
        );
        actionsRequest.Headers.Add("Cookie", cookie);

        var actionsResponse = await httpClient.SendAsync(actionsRequest);
        actionsResponse.EnsureSuccessStatusCode();
        var actionsJson = await actionsResponse.Content.ReadAsStringAsync();

        return JsonSerializer.Deserialize<ActionsResponse>(actionsJson) ?? new ActionsResponse([]);
    }

    private async Task<ActionsResult> ProcessAction(ActionDto action, int orgId, string? cookie)
    {
        var participants = (await GetParticipants(orgId, action.Id, cookie))
            .Data
            .Select(p => new Participant(p));
                
        return new ActionsResult(
            action.Id, 
            action.Title ?? "Event Not Named",
            action.StartTime, 
            participants, 
            action.Activity?.Title ?? "No Event Type");
    }
    
    private async Task<ParticipantsResponse> GetParticipants(int orgId, int actionId, string cookie)
    {
        var participantsRequest = new HttpRequestMessage(
            HttpMethod.Get,
            $"https://app.zetkin.org/api/orgs/{orgId}/actions/{actionId}/participants"
        );
        participantsRequest.Headers.Add("Cookie", cookie);

        var participantsResponse = await httpClient.SendAsync(participantsRequest);
        participantsResponse.EnsureSuccessStatusCode();
        var participantsJson = await participantsResponse.Content.ReadAsStringAsync();

        return JsonSerializer.Deserialize<ParticipantsResponse>(participantsJson) ?? new ParticipantsResponse([]);
    }
}