import React, { useEffect, useState } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import UnAuthorizedApiRequest from '../backend-call/UnAuthorizedApiRequest';
import CategorizeQuestion from '../components/FormAttempt/CategorizeQuestion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComprehensionQuestion from '../components/FormAttempt/ComprehensionQuestion';
import ClozeQuestion from '../components/FormAttempt/ClozeQuestion';
import { OverlayTrigger, Tooltip, Dropdown, Button } from 'react-bootstrap';
import './AttemptForm.css';
import Card from '../components/card';

export default function AttemptForm() {
    let { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [form, setform] = useState([])
    const [formBody, setFormBody] = useState([])

    const fetchForm = async () => {
        let data = await UnAuthorizedApiRequest({ endpoint: `/forms/${id}`, type: 'get' })
        setform(data.data)
        setFormBody(data.data.body)
        setLoading(false)
    }

    useEffect(() => {
        fetchForm();
    }, [])

    return (
        <div className=''>
            {loading ?
                (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
                :
                (
                    <div>
                        <div className='d-flex justify-content-between mt-4 mx-5'>
                            <h4>{form.name}</h4>
                            <h5 className=''>Points: {form.totalPoints}</h5>
                        </div>
                        <div className='m-5 mt-3'>
                            <div className='d-flex'>
                                <div className='col-md-9 overflow-auto'>
                                    <DndProvider backend={HTML5Backend}>
                                        {formBody.map((item) => (
                                            item.type === 'categorize' ? (
                                                <CategorizeQuestion key={item.id} id={item.id} ans={item.ans} cat={item.categories} description={item.description} />
                                            ) :
                                                item.type === 'comprehension' ? (
                                                    <ComprehensionQuestion id={item.id} html_text={item.value} mcqs={item.mcqs} description={item.description} />
                                                ) :
                                                    item.type === 'cloze' ? (
                                                        <ClozeQuestion id={item.id} plainText={item.plainText} options={item.options} description={item.description} />
                                                    ) : (
                                                        <React.Fragment key={item.id}></React.Fragment>
                                                    )
                                        ))}
                                    </DndProvider>
                                </div>
                                <div className='d-flex justify-content-center align-items-center static-part col-md-3 mx-4'>
                                    <Card className="col-md-11">
                                        <Card.Header>
                                            Questions
                                        </Card.Header>
                                        <Card.Body>
                                            <div className='my-2'>Answered: 0</div>
                                            <div className='my-2'>UnAnswered: 0</div>
                                            <div className='my-2'>Marked For Review: 0</div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between mb-5'>
                                <Button className='btn-danger' onClick={() => window.location.reload()}>Reset</Button>
                                <Button className='btn-success'>Submit</Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
