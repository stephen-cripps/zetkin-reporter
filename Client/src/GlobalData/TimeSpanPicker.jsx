import React from 'react';
import { useAppContext } from './AppContext';

const TimeSpanPicker = () => {
    const { timeSpan, setTimeSpan } = useAppContext();
    return (
        <p className='pt-2'>
            Show Data From Past{' '}
            <select className='form-select-sm' onChange={e => setTimeSpan(Number(e.target.value))} value={timeSpan}>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
            </select>{' '}
            months
        </p>
    );
};

export default TimeSpanPicker;
