import React, { useState } from 'react';
import Card from '../components/card'
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormEditor from '../components/FormEditor/FormEditor';
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Dropdown, Button, Form } from 'react-bootstrap';
import CustomToggle from '../components/dropdown';
import UnAuthorizedApiRequest from '../backend-call/UnAuthorizedApiRequest';

const DraggableItem = ({ id, element, index, moveItem, createNewQuestion, deleteQuestion }) => {
    const [, drag] = useDrag({
        type: 'ITEM',
        item: { id, index },
    });

    const [, drop] = useDrop({
        accept: 'ITEM',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div className='my-5 py-2 d-flex' ref={(node) => drag(drop(node))} style={{}}>
            {element}
            <div className='px-2'>
                <div>
                    <Dropdown className="nav-item">
                        <Dropdown.Toggle as={CustomToggle} variant=" nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown">
                            <Link className="col-md-3 text-black">
                                <i className="btn-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" /></svg>
                                </i>
                            </Link>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as="ul" className="dropdown-menu-end">
                            {/* <Dropdown.Item >Reschedule time</Dropdown.Item> */}
                            <Dropdown.Header >Question Types</Dropdown.Header>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => createNewQuestion('categorize')}>Categories</Dropdown.Item>
                            <Dropdown.Item onClick={() => createNewQuestion('cloze')}>Cloze</Dropdown.Item>
                            <Dropdown.Item onClick={() => createNewQuestion('comprehension')}>Comprehension</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div>
                    <Link className='text-black'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" /></svg></Link>
                </div>
                <div>
                    <Link className='text-black' onClick={() => deleteQuestion(id)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z" /></svg></Link>
                </div>
            </div>
        </div>
    );
};


export default function CreateForm() {
    const [form, setForm] = useState([])
    // const history = useHistory();
    const navigate = useNavigate();
    const [formName, setFormName] = useState('')
    const [items, setItems] = useState([]);

    const deleteQuestion = (id) => {
        setItems((prevItems) => prevItems.filter(item => item.id !== id));
        setForm((prevItems) => prevItems.filter(item => item.id !== id));
    }

    const createNewQuestion = (type) => {
        let questionId = uuidv4()
        setItems((prevItems) => [...prevItems, { id: questionId, element: <FormEditor type={type} setForm={setForm} form={form} questionId={questionId} /> }]);
        setForm((prevItems) => [...prevItems, { id: questionId }]);
    }

    const moveItem = (fromIndex, toIndex) => {
        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setItems(updatedItems);
    };

    const saveForm = async () => {
        let totalPoints = 0
        for (let i = 0; i < form.length; i++) {
            totalPoints += parseInt(form[i].points)
        }
        let data = await UnAuthorizedApiRequest({ endpoint: '/forms', type: 'post', body: { name: formName, form, totalPoints } })
        if (data?.status === 200) navigate("/")
    }

    return (
        <div >
            <div className='d-flex justify-content-between mt-4 mx-5'>
                <h4>New Form</h4>
            </div>
            <div className='container'>
                <div className='mt-5 col-md-10'>
                    <h5>Form Name</h5>
                    <input value={formName} onChange={(event) => setFormName(event.target.value)} type="text" className="form-control text-center" placeholder='Enter Form Name' aria-describedby="emailHelp" />
                </div>
                <DndProvider backend={HTML5Backend}>
                    {items.length > 0 ?
                        (
                            <div>
                                {items.map((item, index) => (
                                    <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveItem} createNewQuestion={createNewQuestion} deleteQuestion={deleteQuestion} />
                                ))}
                            </div>
                        )
                        :
                        (
                            <div className='d-flex justify-content-center my-5 py-5 col-md-12'>
                                <h5>No questions, add a new question by clicking on add button </h5>
                                <Dropdown className="nav-item">
                                    <Dropdown.Toggle as={CustomToggle} variant=" nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown">
                                        <Link className="col-md-3 text-black d-flex">
                                            <i className="btn-inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" /></svg>
                                            </i>
                                        </Link>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as="ul" className="dropdown-menu-end">
                                        {/* <Dropdown.Item >Reschedule time</Dropdown.Item> */}
                                        <Dropdown.Header >Question Types</Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => createNewQuestion('categorize')}>Categories</Dropdown.Item>
                                        <Dropdown.Item onClick={() => createNewQuestion('cloze')}>Cloze</Dropdown.Item>
                                        <Dropdown.Item onClick={() => createNewQuestion('comprehension')}>Comprehension</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                        )
                    }
                </DndProvider>
                {/* <Card className="rounded">
                <Card.Body className="d-flex justify-content-between flex-wrap">
                    <div className="header-title">
                        <h4 className="card-title mb-0">Order</h4>
                    </div>
                </Card.Body>
            </Card> */}
                <div className='d-flex justify-content-end'>
                    <Button onClick={() => saveForm()} className='btn-primary'>Save form</Button>
                </div>
            </div>
        </div>
    )
}
