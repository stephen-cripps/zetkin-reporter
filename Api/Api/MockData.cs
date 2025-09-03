using System.Security.Cryptography;
using System.Text;
using Api.Models;
using Api.Models.DTOs;
using Api.Models.Results;

namespace Api;

public static class MockData
{
    public static IEnumerable<OrgsResult> Orgs() => new List<OrgsResult>
    {
        new OrgsResult(1, "Manchester"),
        new OrgsResult(2, "Bristol"),
        new OrgsResult(3, "Brighton"),
    };

    private static readonly string[] ManchesterNames =
    {
        "Alice Smith", "Bob Johnson", "Charlie Davis", "Diana Evans", "Ethan Brown",
        "Fiona Wilson", "George Clark", "Hannah Lewis", "Ian Hall", "Jane Young",
        "Kevin King", "Laura Scott", "Mike Adams", "Nina Baker", "Oscar Harris",
        "Paula Ward", "Quinn Turner", "Rachel Hill", "Sam Green", "Tina Moore"
    };

    private static readonly string[] BristolNames =
    {
        "Adam Wright", "Bethany White", "Carl Thompson", "Deborah Miller", "Edward Harris",
        "Francesca Moore", "Gavin Lee", "Helen Walker", "Ian Parker", "Jessica Hall",
        "Kyle Turner", "Lydia Adams", "Mark Johnson", "Natalie Scott", "Oliver Brown",
        "Patricia Young", "Quentin Lewis", "Rebecca Clark", "Simon King", "Theresa Evans"
    };

    private static readonly string[] BrightonNames =
    {
        "Aaron Price", "Becky Foster", "Chris Webb", "Donna Hughes", "Eliott Mason",
        "Faith Ward", "Graham Cole", "Holly Long", "Isaac Reed", "Jade Simmons",
        "Kieran Grant", "Leah Fox", "Matthew Perry", "Naomi Bailey", "Owen Clarke",
        "Phoebe Russell", "Rory Bennett", "Sophie Carter", "Tommy Hayes", "Ursula Knight"
    };


    private static readonly string[] Genders =
    {
        "Non-Binary", "Male", "Male", "Female", "Male",
        "Female", "Male", "Female", "Male", "Female",
        "Male", "Female", "Male", "Female", "Unknown",
        "Female", "Male", "Non-Binary", "Male", "Female"
    };

    private static readonly string[] EventTypes = { "Meeting", "Training", "Workshop", "Webinar" };

    private static readonly AttendedStatus[] Statuses =
    {
        AttendedStatus.ConfirmedAttended,
        AttendedStatus.NoShow,
        AttendedStatus.Cancelled,
        AttendedStatus.Unknown
    };

    public static List<ActionsResult> Actions(int orgId, int months)
    {
        var orgName = Orgs().Single(o => o.Id == orgId).Title;
        
        // Deterministic seed from organisation name
        int seed = GetDeterministicSeed(orgName);
        var random = new Random(seed);
        
        var names = orgId switch
        {
            1 => ManchesterNames,
            2 => BristolNames,
            3 => BrightonNames,
            _ => [ ]
        };

        var people = names.Select((name, index) => new Person(index + 1, name, Genders[index])).ToList();

        var now = DateTime.UtcNow;
        var startDate = now.AddMonths(-12);
        const int eventCount = 40;
        var dates = new List<DateTime>();

        for (int i = 0; i < eventCount; i++)
        {
            dates.Add(startDate.AddDays(random.Next((now - startDate).Days)));
        }
        
        dates = dates
            .Where(d => d >= now.AddMonths(-months) && d <= now)
            .OrderBy(d => d)
            .ToList();
        
        var events = new List<ActionsResult>();

        foreach (var eventDate in dates)
        {
            int participantCount = random.Next(5, 11);
            
            var participantsForEvent = people
                .OrderBy(_ => random.Next())
                .Take(participantCount)
                .Select(p => new Participant(p, Statuses[random.Next(Statuses.Length)]))
                .ToList();
            
            var eventType = EventTypes[random.Next(EventTypes.Length)];
            
            var eventTypeCount = events.Count(e => e.EventType == eventType);

            events.Add(new ActionsResult(
                Id: eventTypeCount + 1,
                Title: $"{orgName} {eventType} {eventTypeCount + 1}",
                StartTime: eventDate,
                Participants: participantsForEvent,
                EventType: eventType
            ));
        } 
        
        return events;
    }

    private static int GetDeterministicSeed(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return BitConverter.ToInt32(bytes, 0);
    }
}