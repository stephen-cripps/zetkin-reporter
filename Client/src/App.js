import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ChartsTab from './Charts/chartsTab';
import OnionTab from './Onion/onionTab';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { AppProvider, useAppContext } from './GlobalData/AppContext';
import CookieTab from './auth/cookieTab';


function AppContent() {
  const {
    loading,
    cookie,
    activeTab,
    setActiveTab
  } = useAppContext();

  return (
    <div className='App'>
      <main>
        {loading && (
          <div className='spinner-overlay'>
            <div className='spinner'></div>
          </div>
        )}

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className='mt-3'>
          <Tab eventKey='cookie' title='Set Cookie'>
            <CookieTab />
          </Tab>
          <Tab eventKey='charts' title='Charts' disabled={!cookie}>
            <ChartsTab />
          </Tab>
          <Tab eventKey='onion' title='Onion' disabled={!cookie}>
            <OnionTab />
          </Tab>
        </Tabs>
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
ToDo: 
 - Grab backend URL from ENV
 - Add Page Title
 - Sort out HTTPS
 - Host & Share (Small scale)
 - Some kind of ddos protection
 - Better Error Handling
 - Caching 
 - Save Onion
 - Make the onion less ugly
 - Persist the onion if AppContext changes (particularly data from past x months)

Graphs to build:
 - Participants per event, split on gender
 - Shows/No Shows per event
*/
