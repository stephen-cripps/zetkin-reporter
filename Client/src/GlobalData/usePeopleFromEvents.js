import { useAppContext } from './AppContext';
import { useMemo } from 'react';

// Returns people with attendance stats and gender, ready for OnionTab and attendanceByMember
export default function usePeopleFromEvents() {
    const { events } = useAppContext();
    return useMemo(() => {
        const peopleMap = new Map();
        events.forEach(event => {
            (event.participants || []).forEach(p => {
                const id = p.person.id;
                if (!peopleMap.has(id)) {
                    peopleMap.set(id, {
                        id,
                        name: p.person.name,
                        attended: 0,
                        cancelled: 0,
                        noShows: 0,
                        gender: p.person.gender,
                        eventsAttended: [],
                    });
                }
                const person = peopleMap.get(id);
                switch (p.attendedStatus) {
                    case 0:
                        person.attended += 1;
                        break;
                    case 1:
                        person.cancelled += 1;
                        break;
                    case 2:
                        person.noShows += 1;
                        break;
                    default:
                        break;
                }

                person.eventsAttended.push(event);
            });
        });
        return Array.from(peopleMap.values());
    }, [events]);
}
