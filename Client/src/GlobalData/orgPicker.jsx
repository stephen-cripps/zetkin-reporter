import React from 'react';
import { useAppContext } from './AppContext';

const OrgPicker = () => {
    const { orgs, selectedOrg, setSelectedOrg, events, loading, timeSpan, setTimeSpan } = useAppContext();
    return (
        <>
            <select onChange={e => setSelectedOrg(e.target.value)} value={selectedOrg || ''}>
                <option value=''>Select Organization</option>
                {orgs.map(org => (
                    <option key={org.id} value={org.id}>
                        {org.title}
                    </option>
                ))}
            </select>
            <p className='pt-2'>
                Show Data From Past{' '}
                <select className='form-select-sm' onChange={e => setTimeSpan(Number(e.target.value))} value={timeSpan}>
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                </select>{' '}
                months
            </p>
            {!selectedOrg && <p className='pt-2'>Select an organization to view data.</p>}
            {
                selectedOrg && events.length === 0 && !loading && (
                    <p className='pt-2'>No events found for the selected organization in the selected time frame.</p>
                )
            }
        </>
    );
};

export default OrgPicker;