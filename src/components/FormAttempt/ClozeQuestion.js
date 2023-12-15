import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { OverlayTrigger, Tooltip, Dropdown, Button } from 'react-bootstrap';
import Card from '../card';

const Word = ({ text, onDrop }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'WORD',
        item: { text },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', border: 'solid 1px grey', borderRadius: 6, textAlign: 'center' }} className='d-flex  justify-content-center align-items-center col-md-3 px-3 py-2 my-2 mx-1'>
            <span>{text}</span>
        </div>
    );
};

const Blank = ({ onDrop }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'WORD',
        drop: (item) => onDrop(item.text),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    const isActive = canDrop && isOver;

    return (
        <div ref={drop} style={{ border: isActive ? '2px dashed #000' : '2px dashed transparent', padding: '10px' }}>
            Drop here
        </div>
    );
};

export default function ClozeQuestion({ id, plainText, options, description }) {
    const [filledBlanks, setFilledBlanks] = useState([]);

    const handleDrop = (word) => {
        // Handle the dropped word, you may want to update state accordingly
        setFilledBlanks([...filledBlanks, word]);
    };

    return (
        <div className='my-5'>
            <Card>
                <Card.Body>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h4>Question</h4>
                        <div className='d-flex align-items-center'>
                            <i className='mx-2'>Cloze</i>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="tooltip-categorize"> Users complete sentences or paragraphs by filling in the blanks, enhancing engagement and assessing understanding by requiring them to provide missing information in a contextual context</Tooltip>}
                            >
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="#002147" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></svg>
                                </div>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div>
                        {/* Render the question text with blanks */}
                        {plainText?.split(' ')?.map((word, index) => (
                            word === '______' ? (
                                <Blank key={index} onDrop={handleDrop} />
                            ) : (
                                <span key={index}>{word} </span>
                            )
                        ))}
                    </div>
                    <div className='d-flex flex-wrap mt-4'>
                        {options?.map((word, index) => (
                            <Word key={index} text={word.text} onDrop={handleDrop} />
                        ))}
                    </div>
                    {description ?
                        (
                            <div className='mt-5'>
                                <h6>Description:</h6>
                                <p>{description}</p>
                            </div>
                        )
                        :
                        (
                            <></>
                        )
                    }
                </Card.Body>
            </Card>
        </div>
    );
}
