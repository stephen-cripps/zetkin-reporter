import './App.css';
import { useEffect, useState } from 'react';
import { getEvents, getOrgs } from './zetkin-service';
import AttendanceTimelineChart from './Charts/attendanceTimeline';
import MemberAttendanceChart from './Charts/attendanceByMember';

function App() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      const orgs = await getOrgs();
      setOrgs(orgs);
      setLoading(false);
    }

    fetchOrgs();
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;

    async function fetchEvents() {
      setLoading(true);
      const events = await getEvents(selectedOrg);
      setEvents(events);
      setLoading(false);
    }

    fetchEvents();
  }, [selectedOrg]);



  return (
    <div className="App">
      <main>
        <select
          onChange={(e) => setSelectedOrg(e.target.value)}
          value={selectedOrg || ''}
        >
          <option value="">Select Organization</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.title}
            </option>
          ))}
        </select>

        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {selectedOrg && events.length === 0 && !loading && (
          <p>No events found for the selected organization.</p>
        )}

        {selectedOrg && events.length > 0 && !loading && (
          <>
            <MemberAttendanceChart events={events} />
            <AttendanceTimelineChart events={events} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;

/*
Controls to Add: 
 - Organisation Drop Down
 - Time Span Selector

Graphs to build:
 - Change in attendance from past x weeks to previous x weeks
 - Participants per event, split on gender
 - Shows/No Shows per event

Interactive Onion: 
  - Get X most active members over the past Y weeks
  - Allow users to drag them into the Onion categories (default not engaged) Not Engaged, Attending, Engaged, Taking Responsibility, Leading
  - Show Attendance stats on hover
  - Can save & load onions (Need to consider how best to load onion and whether to mix in with updated Zetkin data)
*/