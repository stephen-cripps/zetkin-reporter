using System.Text.Json.Serialization;

namespace ServerlessAPI.Models.DTOs;

public record OrgsResponse(
    [property: JsonPropertyName("data")] IEnumerable<OrgDto> Data
);

public record OrgDto(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string? Title
);