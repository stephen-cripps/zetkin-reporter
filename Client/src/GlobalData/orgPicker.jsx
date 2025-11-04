import React from 'react';
import { useAppContext } from './AppContext';

const OrgPicker = () => {
    const { orgs, selectedOrg, setSelectedOrg } = useAppContext();
    return (
        <select onChange={e => setSelectedOrg(e.target.value)} value={selectedOrg || ''}>
            <option value=''>Select Organization</option>
            {orgs.map(org => (
                <option key={org.id} value={org.id}>
                    {org.title}
                </option>
            ))}
        </select>
    );
};

export default OrgPicker;