import './App.css';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ChartsTab from './Charts/chartsTab';
import OnionTab from './Onion/onionTab';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OrgPicker from './GlobalData/orgPicker';
import TimeSpanPicker from './GlobalData/TimeSpanPicker';
import { AppProvider, useAppContext } from './GlobalData/AppContext';


function AppContent() {
  const [activeTab, setActiveTab] = useState('charts');
  const {
    selectedOrg,
    events,
    loading
  } = useAppContext();

  return (
    <div className='App'>
      <main>
        <OrgPicker />
        <TimeSpanPicker />

        {loading && (
          <div className='spinner-overlay'>
            <div className='spinner'></div>
          </div>
        )}

        {!selectedOrg && <p className='pt-2'>Select an organization to view data.</p>}

        {selectedOrg && events.length === 0 && !loading && (
          <p className='pt-2'>No events found for the selected organization.</p>
        )}

        {selectedOrg && events.length > 0 && !loading && (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className='mt-3'>
            <Tab eventKey='charts' title='Charts'>
              <ChartsTab />
            </Tab>
            <Tab eventKey='onion' title='Onion'>
              <OnionTab />
            </Tab>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

/*
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
