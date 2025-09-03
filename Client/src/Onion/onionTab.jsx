import { useEffect, useState } from 'react';
import OnionLayer from './onionLayer';
import { DndContext } from '@dnd-kit/core';

const OnionTab = ({ events }) => {
  const [peopleMap, setPeopleMap] = useState({});
  const [mostActiveCount, setMostActiveCount] = useState(10);
  const [filteredPeople, setFilteredPeople] = useState([]);

  const tiers = [
    { id: 'leading', title: 'Leading', colour: '#46e3ffff' },
    { id: 'responsibility', title: 'Taking Responsibility', colour: '#6eff90ff' },
    { id: 'engaging', title: 'Engaging', colour: '#f3e34fff' },
    { id: 'attending', title: 'Attending', colour: '#ffad50ff' },
    { id: 'not-engaged', title: 'Not Engaged', colour: '#f0828bff' },
    { id: 'not-assigned', title: 'Not Assigned', colour: '#e2e2e2ff' },
  ];

  // ToDo: Make the data flow less janky
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
    setPeopleMap(map);
  }, [events]);

  useEffect(() => {
    const filtered = Object.values(peopleMap)
      .filter((p) => p.attended > 0)
      .sort((a, b) => b.attended - a.attended)
      .slice(0, mostActiveCount);
    setFilteredPeople(filtered);
  }, [peopleMap, mostActiveCount]);

  const droppables = () =>
    tiers.map((tier) => {
      const people = filteredPeople.filter((p) => p.currentTier === tier.id);

      return <OnionLayer key={tier.id} tier={tier} people={people} />;
    });

  function handleDragEnd({ active, over }) {
    if (!over) return;

    setPeopleMap((prev) => ({
      ...prev,
      [active.id]: {
        ...prev[active.id],
        currentTier: over.id,
      },
    }));
  }

  return (
    <div className='card tabCard'>
      <h2>Onion</h2>
      <h4>It's flat, like the earth</h4>
      <p className='pt-2'>
        Show{' '}
        <select className='form-select-sm' onChange={(e) => setMostActiveCount(e.target.value)} value={mostActiveCount}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>{' '}
        most active members
      </p>
      <DndContext onDragEnd={handleDragEnd}>{droppables()}</DndContext>
    </div>
  );
};

export default OnionTab;
