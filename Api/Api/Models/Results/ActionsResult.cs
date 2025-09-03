using Api.Models.DTOs;

namespace Api.Models.Results;

public record ActionsResult(int Id, string Title, DateTime? StartTime, IEnumerable<Participant> Participants, string EventType);

public record Participant
{
    // Ctor used when creating from DTO
    public Participant(ParticipantDto participant)
    {
        Person = new Person(
            participant.Id,
            $"{participant.FirstName} {participant.LastName}",
            participant.Gender);

        if (participant.Attended != null)
            AttendedStatus = AttendedStatus.ConfirmedAttended;
        else if (participant.NoShow != null)
            AttendedStatus = AttendedStatus.NoShow;
        else if (participant.Cancelled != null)
            AttendedStatus = AttendedStatus.Cancelled;
        else
            AttendedStatus = AttendedStatus.Unknown;

    }

    // Ctor used for mock data
    public Participant(Person person, AttendedStatus attendedStatus)
    {
        Person = person;
        AttendedStatus = attendedStatus;
    }

    public Person Person { get; init; }
    public AttendedStatus AttendedStatus { get; init; }
}

public record Person(int Id, string Name, string Gender);