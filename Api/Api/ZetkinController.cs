using System.Net.Http.Headers;
using System.Text.Json;
using Api.Models;
using Api.Models.DTOs;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;

namespace Api;

[ApiController]
[Route("api/[controller]")]
public class ZetkinController : ControllerBase
{
    private readonly HttpClient httpClient;
    private readonly IConfiguration config;
    private readonly int orgId;
    private readonly string cookie;

    public ZetkinController(HttpClient httpClient, IConfiguration config)
    {
        this.httpClient = httpClient;
        this.config = config;
        cookie = this.config["cookie"] ?? throw new NullReferenceException("cookie");
        orgId = int.Parse(this.config["orgId"] ?? throw new NullReferenceException("orgId"));
    }

    // ToDo: Add some filter options
    [HttpGet("all-actions")]
    public async Task<IEnumerable<ActionsResult>> GetAllActions()
    {
        var actions = await GetAction();

        // Testing my actions only
        var filteredActions = actions.Data
            .Where(a => a.Title?.Contains("Steve's") == true);
        
        var actionResults = new List<ActionsResult>();

        foreach (var act in filteredActions)
        {
            var participants = (await GetParticipants(act.Id))
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

    private async Task<ActionsResponse> GetAction()
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
    
    private async Task<ParticipantsResponse> GetParticipants(int actionId)
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