using System.Text.Json.Serialization;

namespace ZetkinReporter.Api.Models.DTOs;

public record ActionsResponse([property: JsonPropertyName("data")] IEnumerable<ActionDto> Data);
public record ActionDto(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string? Title,
    [property: JsonPropertyName("start_time")] DateTime? StartTime,
    [property: JsonPropertyName("activity")] ActivityDto? Activity
);

public record ActivityDto(
    [property: JsonPropertyName("title")] string? Title
);