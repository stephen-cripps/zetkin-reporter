import './App.css';
import { useEffect, useState } from 'react';
import { getEvents, getParticipants } from './zetkin-service';
import AttendanceChart from './Charts/attendance';

function App() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      console.log("Fetching events...");
      const events = await getEvents();

      setEvents(events);
    }

    fetchEvents();
  }, []);

  const getAttendedStatus = (status) => {
    switch (status) {
      case 0:
        return 'Attended';
      case 1:
        return 'No Show';
      case 2:
        return 'Cancelled';
      case 3:
      default:
        return 'Unknown';
    }
  };

  //ToDo: Add org selector for data
  return (
    <div className="App">
      <main>
        <AttendanceChart events={events} />
      </main>
    </div>
  );
}

export default App;

/*
Graphs to build:
 - Events person attended in past x weeks
 - Change in attendance from past x weeks to previous x weeks
 - Participants per event, with category colours
 - Participants per event, split on gender
 - Shows/No Shows per event

Interactive Onion: 
  - Get X most active members over the past Y weeks
  - Allow users to drag them into the Onion categories (default not engaged) Not Engaged, Attending, Engaged, Taking Responsibility, Leading
  - Show Attendance stats on hover
  - Can save & load onions (Need to consider how best to load onion and whether to mix in with updated Zetkin data)
*/