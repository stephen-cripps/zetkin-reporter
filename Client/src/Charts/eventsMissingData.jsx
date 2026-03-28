import { useState } from "react";
import { useAppContext } from "../GlobalData/AppContext"

const EventsMissingData = () => {
    const { events } = useAppContext();
    const [show, setShow] = useState(true);

    const missingDataEvents = events.filter(event => {
        return !event.participants || event.participants.length === 0 || (event.participants.every(p => p.attendedStatus === 3));
    });

    return (
        missingDataEvents && missingDataEvents.length > 0 && (
            <div>
                {show ?
                    <>
                        <h3>The following events have no participant attendance data <button className="btn btn-secondary btn-sm mx-2 py-0" onClick={() => setShow(false)}>Hide</button></h3>
                        <ul>
                            {missingDataEvents.map(event => (
                                <li key={event.id}>{event.title} - {new Date(event.startTime).toLocaleDateString()}</li>
                            ))}
                        </ul>
                    </>
                    : <button className="btn btn-secondary btn-sm my-2" onClick={() => setShow(true)}>Show Events with Missing Data</button>}
            </div>
        )
    );
}

export default EventsMissingData;