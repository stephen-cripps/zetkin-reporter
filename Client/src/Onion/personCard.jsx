
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const PersonCard = ({ person }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: person.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        width: "min-content",
        backgroundColor: "lightGray",
        borderColor: "darkGray",
    };

    return (
        <button className="btn" ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {/* ToDo: Show Stats on hover  */}
            {person.name}
        </button>
    );
}

export default PersonCard
