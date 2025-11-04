import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEvents, getOrgs } from '../zetkin-service';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [orgs, setOrgs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [timeSpan, setTimeSpan] = useState(3);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [people, setPeople] = useState({});

    // Fetch orgs on mount
    useEffect(() => {
        async function fetchOrgs() {
            setLoading(true);
            const orgs = await getOrgs();
            setOrgs(orgs);
            setLoading(false);
        }
        fetchOrgs();
    }, []);

    // Fetch events when org or timespan changes
    useEffect(() => {
        if (!selectedOrg) return;
        async function fetchEvents() {
            setLoading(true);
            const events = await getEvents(selectedOrg, timeSpan);
            setEvents(events);
            setLoading(false);
        }
        fetchEvents();
    }, [selectedOrg, timeSpan]);

    // Build people when events change
    useEffect(() => {
        const map = {};
        events.forEach((e) => {
            e.participants.forEach((p) => {
                const id = p.person.id;
                if (!map[id]) {
                    map[id] = {
                        id,
                        name: p.person.name,
                        attended: 0,
                        cancelled: 0,
                        noShows: 0,
                        currentTier: 'not-assigned',
                        gender: p.person.gender,
                    };
                }
                switch (p.attendedStatus) {
                    case 0:
                        map[id].attended += 1;
                        break;
                    case 1:
                        map[id].cancelled += 1;
                        break;
                    case 2:
                        map[id].noShows += 1;
                        break;
                    default:
                        break;
                }
            });
        });
        setPeople(Object.values(map));
    }, [events]);

    return (
        <AppContext.Provider value={{
            orgs, selectedOrg, setSelectedOrg,
            timeSpan, setTimeSpan,
            events, loading, people
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
