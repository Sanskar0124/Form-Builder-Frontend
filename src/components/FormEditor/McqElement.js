import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Card from '../card';

const MCQElement = ({ id, question, options, onSelectOption, handleOptionChange }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptions = (option) => {
        setSelectedOption(option)
        handleOptionChange(id, option)
    }

    return (
        <div style={{ cursor: 'move' }}>
            <Card>
                <Card.Body>
                    <div className='d-flex'>
                        <h6>Q. </h6>
                        <p className='mx-2'>{question}</p>
                    </div>
                    <Form>
                        {options?.map((option) => (
                            <Form.Check
                                key={option.id}
                                type="radio"
                                label={option.text}
                                checked={selectedOption && selectedOption.id === option.id}
                                onChange={() => handleOptions(option)}
                            />
                        ))}
                    </Form>
                </Card.Body>
            </Card>

        </div>
    );
};

export default MCQElement;
