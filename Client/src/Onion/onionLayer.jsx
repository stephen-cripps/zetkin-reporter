import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import PersonCard from './personCard';

const OnionLayer = ({ tier, people }) => {
    const { setNodeRef } = useDroppable({
        id: tier.id,
    });

    return (
        <div ref={setNodeRef} className="tierContainer">
            <div className="card tierCard" style={{ backgroundColor: tier.colour }}>
                <div className="row align-items-start">
                    <div className="col-2 tierTitle">
                        {/* ToDo: Deal with these titles not stretching the full height of the container */}
                        <h2>{tier.title}</h2>
                    </div>
                    <div className="col-10 draggablesContainer">
                        {people.map((p) => (
                            <PersonCard key={p.id} person={p} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnionLayer;
