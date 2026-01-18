import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEvents, getOrgs } from '../zetkin-service';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [orgs, setOrgs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [timeSpan, setTimeSpan] = useState(3);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookie, setCookie] = useState(undefined);
    const [activeTab, setActiveTab] = useState('cookie');
    const [error, setError] = useState(null);

    // Fetch orgs on mount
    useEffect(() => {
        if (cookie === undefined) return;

        async function fetchOrgs(cookie) {
            setLoading(true);
            setError(null);
            try {
                const orgs = await getOrgs(cookie);
                setOrgs(orgs);
            } catch (error) {
                console.error("Error fetching orgs:", error);
                setError("Error fetching orgs: " + error.message);
            }
            setLoading(false);
        }
        fetchOrgs(cookie);
    }, [cookie]);

    // Fetch events when org or timespan changes
    useEffect(() => {
        if (!selectedOrg) return;
        async function fetchEvents() {
            setLoading(true);
            const events = await getEvents(selectedOrg, timeSpan, cookie);
            setEvents(events);
            setLoading(false);
        }
        fetchEvents();
    }, [selectedOrg, timeSpan, cookie]);

    return (
        <AppContext.Provider value={{
            orgs,
            selectedOrg,
            setSelectedOrg,
            timeSpan,
            setTimeSpan,
            events,
            loading,
            setCookie,
            cookie,
            activeTab,
            setActiveTab,
            error
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
