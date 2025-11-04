import { useEffect, useState } from 'react';
import OnionLayer from './onionLayer';
import { DndContext } from '@dnd-kit/core';
import Form from 'react-bootstrap/Form';
import { useAppContext } from '../GlobalData/AppContext';

const OnionTab = () => {

  const { events } = useAppContext();
  const [peopleMap, setPeopleMap] = useState({});
  const [mostActiveCount, setMostActiveCount] = useState(10);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);

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
        console.log(p.person.name, p.person.gender);
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
    setPeopleMap(map);
  }, [events]);

  useEffect(() => {
    var people = Object.values(peopleMap);

    people = people
      .filter((p) => genderFilter.length === 0 || genderFilter.includes(p.gender));

    var attendanceThreshold =
      people
        .sort((a, b) => b.attended - a.attended)
        .slice(0, mostActiveCount)
        .pop()?.attended ?? 1;

    console.log({ attendanceThreshold });

    people = people.filter((p) => p.attended >= attendanceThreshold);

    var previousRank = 0;
    var previousCount = 0;

    for (var i = 0; i < people.length; i++) {
      if (people[i].attended === previousCount) {
        people[i].rank = previousRank;
      } else {
        people[i].rank = i + 1;
      }
      previousCount = people[i].attended;
      previousRank = people[i].rank;
    }

    setFilteredPeople(people);
  }, [peopleMap, mostActiveCount, genderFilter]);

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
      <p>Filter by Gender </p>
      <div key={`inline-checkbox`} className='mb-3'>
        {['Male', 'Female', 'Non-Binary', 'Unknown'].map((gender) => (
          <Form.Check
            inline
            label={gender.charAt(0).toUpperCase() + gender.slice(1)}
            type='checkbox'
            id={gender}
            key={gender}
            checked={genderFilter.includes(gender)}
            onChange={(e) => {
              if (e.target.checked) {
                setGenderFilter((prev) => [...prev, gender]);
              } else {
                setGenderFilter((prev) => prev.filter((g) => g !== gender));
              }
            }}
          />
        ))}
      </div>

      <DndContext onDragEnd={handleDragEnd}>{droppables()}</DndContext>
    </div>
  );
};

export default OnionTab;
