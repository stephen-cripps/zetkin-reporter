import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const PersonCard = ({ person }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: person.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    width: 'min-content',
    backgroundColor: 'lightGray',
    borderColor: 'darkGray',
  };

  const tooltipContent = (
    <Tooltip id={`tooltip-${person.id}`} style={{ maxWidth: '250px' }}>
      <div>
        <strong>{person.name}</strong>
        <p>Events Attended: {person.attended}</p>
        <p>No Shows: {person.noShows}</p>
        <p>Cancelled: {person.cancelled}</p>
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger placement='top' overlay={tooltipContent} delay={{ show: 250, hide: 100 }}>
      <button className='btn' ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {person.name}
      </button>
    </OverlayTrigger>
  );
};

export default PersonCard;
