using System.Text.Json.Serialization;

namespace Api.Models.DTOs;

public record ActionsResponse([property: JsonPropertyName("data")] IEnumerable<ActionDto> Data);
public record ActionDto(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string? Title,
    [property: JsonPropertyName("start_time")] DateTime? StartTime
);