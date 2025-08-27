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
    private readonly IConfiguration config;
    private readonly string cookie;

    public ZetkinController(HttpClient httpClient, IConfiguration config)
    {
        this.httpClient = httpClient;
        this.config = config;
        cookie = this.config["cookie"] ?? throw new NullReferenceException("cookie");
    }

    [HttpGet("orgs")]
    public async Task<IEnumerable<OrgsResult>> GetOrgs()
    {
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
    public async Task<IEnumerable<ActionsResult>> GetAllActions(int orgId)
    {
        var actions = await GetAction(orgId);
        
        var filteredActions = actions.Data
            .Where(a => a.StartTime != null && a.StartTime >= DateTime.Now.AddMonths(-3) && a.StartTime <= DateTime.Now)
            .Where(a => a.Title?.Contains("Steve") == true)
            .OrderBy(a => a.StartTime);
        
        var actionResults = new List<ActionsResult>();

        foreach (var act in filteredActions)
        {
            // ToDo: Multithreading
            var participants = (await GetParticipants(orgId, act.Id))
                .Data
                .Select(p => new Participant(p));
                
            actionResults.Add(new ActionsResult(
                act.Id, 
                act.Title ?? "Event Not Named",
                act.StartTime, 
                participants, 
                act.Activity?.Title ?? "No Event Type"));
        }

        return actionResults;
    }

    private async Task<ActionsResponse> GetAction(int orgId)
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
    
    private async Task<ParticipantsResponse> GetParticipants(int orgId, int actionId)
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