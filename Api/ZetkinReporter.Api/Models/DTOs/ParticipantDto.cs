using System.Text.Json.Serialization;

namespace ZetkinReporter.Api.Models.DTOs;

public record ParticipantsResponse([property: JsonPropertyName("data")] IEnumerable<ParticipantDto> Data);

public record ParticipantDto(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("first_name")] string FirstName,
    [property: JsonPropertyName("last_name")] string LastName,
    [property: JsonPropertyName("gender")] string Gender,
    [property: JsonPropertyName("attended")] DateTime? Attended,
    [property: JsonPropertyName("cancelled")] DateTime? Cancelled,
    [property: JsonPropertyName("noshow")] DateTime? NoShow
);