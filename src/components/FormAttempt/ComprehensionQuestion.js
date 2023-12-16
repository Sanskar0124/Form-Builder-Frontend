import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Card from '../card'
import MCQElement from '../FormEditor/McqElement';
import { OverlayTrigger, Tooltip, Dropdown, Button } from 'react-bootstrap';

export default function ComprehensionQuestion({ html_text, mcqs, description }) {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (option) => {
        setSelectedOption(option)
        // handleOptionChange(id, option)
    }

    return (
        <div className='my-5'>
            <Card>
                <Card.Body>
                    <div className='d-flex justify-content-between'>
                        <h4>Question</h4>
                        <div className='d-flex align-items-center'>
                            <i className='mx-2'>Comprehension</i>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="tooltip-categorize">  Users answer multiple-choice questions (MCQs) to assess understanding, providing a structured way to evaluate knowledge by presenting a set of options related to a given passage or scenario</Tooltip>}
                            >
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="#002147" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></svg>

                                </div>
                            </OverlayTrigger>
                        </div>

                    </div>
                    <div className='mt-4' dangerouslySetInnerHTML={{ __html: html_text }} />

                    <Form className='my-5'>
                        {mcqs?.map((item) => (
                            <div className='my-3'>
                                <MCQElement id={item.id} question={item.text} options={item.mcqOptions} handleOptionChange={handleOptionChange} />
                            </div>
                        ))}
                    </Form>

                    {description ?
                        (
                            <div>
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
