import { useAppContext } from "../GlobalData/AppContext"

const EventsMissingData = () => {
    const { events } = useAppContext();
    const missingDataEvents = events.filter(event => {
        return !event.participants || event.participants.length === 0;
    });

    return (
        missingDataEvents && missingDataEvents.length > 0 && (
            <div>
                <h3>The following events have no participant data</h3>
                <ul>
                    {missingDataEvents.map(event => (
                        <li key={event.id}>{event.title} - {new Date(event.startTime).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>
        )
    );
}

export default EventsMissingData;