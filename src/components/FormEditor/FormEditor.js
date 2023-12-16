import React, { useState, useEffect } from 'react';
import Card from '../card'
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TextElement from './TextElement';
import TextElementWithDD from './TextElementWithDD';
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams, useHistory } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Dropdown, Button } from 'react-bootstrap';
import CustomToggle from '../dropdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faUpload } from '@fortawesome/free-solid-svg-icons';
import MCQElement from './McqElement';

const DraggableItem = React.memo(({ id, element, index, moveItem }) => {
    const [, drag] = useDrag({
        type: 'CARD',
        item: { id, index },
    });

    const [, drop] = useDrop({
        accept: 'CARD',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div className='my-2' ref={(node) => drag(drop(node))} style={{}}>
            {element}
        </div>
    );
});

const FormEditor = ({ questionId, type, setForm }) => {
    const [points, setPoints] = useState()
    const [newItem, setNewItem] = useState("")
    const [newAns, setNewAns] = useState("")
    const [newCat, setNewCat] = useState("")
    const [newBlank, setNewBlank] = useState("")
    const [editorValue, setEditorValue] = useState('');
    const [previewValue, setpreviewValue] = useState('')
    const [prevUnderlinedWords, setPrevUnderlinedWords] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [description, setDescription] = useState("");
    const [items, setItems] = useState([]);
    const [ans, setAns] = useState([]);
    const [cat, setCat] = useState([]);
    const [blanks, setBlanks] = useState([])
    const [mcqsOptions, setMcqsOptions] = useState([])
    const [mcqs, setMcqs] = useState([])
    const [mcqRadioOptions, setmcqRadioOptions] = useState([])
    const [newMcqQuestion, setnewMcqQuestion] = useState("")
    const [newMcqOption, setnewMcqOption] = useState([])
    const [catOptions, setCatOptions] = useState([])
    const [catAns, setCatAns] = useState([])
    const [ddToggle, setDdToggle] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null);
    const [itemOrder, setItemOrder] = useState([]);

    useEffect(() => {
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId ? { ...item, type } : item
            )
        );
    }, [])


    const storeAns = (catId, cat, ansId, ans) => {
        setAns((prevItems) =>
            prevItems.map((item) =>
                item.id === ansId
                    ? {
                        ...item,
                        catId,
                        cat
                    }
                    : item
            )
        );
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId
                    ? {
                        ...item,
                        ans: item.ans.map((item2) => item2.id === ansId ?
                            {
                                ...item2,
                                catId,
                                cat
                            } :
                            item2)
                    }
                    : item
            )
        );
    };

    const additem = (type) => {
        switch (type) {
            case 'item':
                if (!newItem) return;
                let itemId = uuidv4()
                setItems((prevItems) => [...prevItems, { id: itemId, text: newItem, element: <span><TextElement text={newItem} id={itemId} type={'item'} deleteItem={deleteItem} /></span> }]);
                setCatOptions(prevOptions => [...prevOptions, { value: itemId, label: newItem }]);
                setNewItem("");
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                categories: Array.isArray(item.categories)
                                    ? [...item.categories, { id: itemId, text: newItem }]
                                    : [{ id: itemId, text: newItem }],
                            }
                            : item
                    )
                );
                break;
            case 'ans':
                if (!newAns) return;
                let ansId = uuidv4()
                let catId = uuidv4()
                setAns([...ans, { id: ansId, text: newAns, element: <TextElementWithDD catOptions={catOptions} ansId={ansId} storeAns={storeAns} text={newAns} id={ansId} type={'ans'} catId={catId} deleteItem={deleteItem} /> }])
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                ans: Array.isArray(item.ans)
                                    ? [...item.ans, { id: ansId, text: newAns }]
                                    : [{ id: ansId, text: newAns }],
                            }
                            : item
                    )
                );
                setNewAns("");
                break;
            case 'cat':
                if (!newCat) return;
                setNewCat("");
                break;
            case 'blank':
                if (!newBlank) return;
                let blankId = uuidv4()
                setBlanks((prevItems) => [...prevItems, { id: blankId, text: newBlank, removable: true, element: <span><TextElement text={newBlank} id={blankId} type={'blank'} deleteItem={deleteItem} /></span> }]);
                setNewBlank("");
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                options: Array.isArray(item.options)
                                    ? [...item.options, { id: blankId, text: newBlank, removable: true }]
                                    : [{ id: blankId, text: newBlank, removable: true }],
                            }
                            : item
                    )
                );
                break;
            case 'mcqOption':
                if (!newMcqOption) return;
                let mcqOptionsId = uuidv4()
                setMcqsOptions((prevItems) => [...prevItems, { id: mcqOptionsId, text: newMcqOption, element: <span><TextElement text={newMcqOption} id={mcqOptionsId} type={'mcqOption'} deleteItem={deleteItem} isMcqOption={true} /></span> }]);
                setmcqRadioOptions((prevItems) => [...prevItems, { id: mcqOptionsId, text: newMcqOption }]);
                setnewMcqOption("");
                break;
            case 'mcq':
                if (!newMcqQuestion) return;
                if (mcqsOptions.length < 2) return;
                let mcqId = uuidv4()
                setMcqs((prevItems) => [...prevItems, { id: mcqId, mcqOptions: mcqRadioOptions, text: newMcqQuestion, element: <span><MCQElement question={newMcqQuestion} id={mcqId} type={'mcq'} handleOptionChange={handleOptionChange} options={mcqRadioOptions} deleteItem={deleteItem} onSelectOption={handleMCQOptionSelect} /></span> }]);
                setMcqsOptions([]);
                setnewMcqQuestion("");
                setnewMcqOption("");
                setmcqRadioOptions([]);
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                mcqs: Array.isArray(item.mcqs)
                                    ? [...item.mcqs, { id: mcqId, text: newMcqQuestion, mcqOptions: mcqRadioOptions }]
                                    : [{ id: mcqId, text: newMcqQuestion, mcqOptions: mcqRadioOptions }],
                            }
                            : item
                    )
                );
                break;

            default:
                break;
        }
    }

    const deleteItem = (id, type, catId = null) => {
        switch (type) {
            case 'item':
                setItems((prevItems) => prevItems.filter(item => item.id !== id));
                setCatOptions((prevItems) => prevItems.filter(item => item.id !== id));
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                categories: Array.isArray(item.categories)
                                    ? item.categories.filter((category) => category.id !== id)
                                    : [],
                            }
                            : item
                    )
                );
                break;
            case 'ans':
                setAns((prevItems) => prevItems.filter(item => item.id !== id));
                setCat((prevItems) => prevItems.filter(item => item.id !== catId));
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                ans: Array.isArray(item.ans)
                                    ? item.ans.filter((item2) => item2.id !== id)
                                    : [],
                            }
                            : item
                    )
                );
                break;
            case 'blank':
                setBlanks((prevItems) => prevItems.filter(item => item.id !== id));
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId
                            ? {
                                ...item,
                                options: Array.isArray(item.options)
                                    ? item.options.filter((item2) => item2.id !== id)
                                    : [],
                            }
                            : item
                    )
                );
                break;
            case 'mcqOption':
                setMcqsOptions((prevItems) => prevItems.filter(item => item.id !== id));
                setmcqRadioOptions((prevItems) => prevItems.filter(item => item.id !== id));
                break;

            default:
                break;
        }
    }

    const moveItem = (fromIndex, toIndex) => {
        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);

        setItems(updatedItems);
        // Update setForm to include the order
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId
                    ? {
                        ...item,
                        categories: updatedItems.map((updatedItem) => ({
                            id: updatedItem.id,
                            text: updatedItem.text
                        }))
                    }
                    : item
            )
        );
    };

    const moveAns = (fromIndex, toIndex) => {
        const updatedItems = [...ans];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setAns(updatedItems);
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId
                    ? {
                        ...item,
                        ans: updatedItems.map((updatedItem) => ({
                            id: updatedItem.id,
                            text: updatedItem.text,
                            catId: updatedItem.catId,
                            cat: updatedItem.cat
                        }))
                    }
                    : item
            )
        );
    };

    const moveCat = (fromIndex, toIndex) => {
        const updatedItems = [...cat];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setCat(updatedItems);
    };

    const moveBlanks = (fromIndex, toIndex) => {
        const updatedItems = [...blanks];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setBlanks(updatedItems);
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId
                    ? {
                        ...item,
                        options: updatedItems.map((updatedItem) => ({
                            id: updatedItem.id,
                            text: updatedItem.text,
                            removable: updatedItem.removable
                        }))
                    }
                    : item
            )
        );
    };

    const moveMcqOptions = (fromIndex, toIndex) => {
        const updatedItems = [...mcqsOptions];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setMcqsOptions(updatedItems);
        setmcqRadioOptions(updatedItems.map((updatedItem) => ({
            id: updatedItem.id,
            text: updatedItem.text,
        }))
        )
    };

    const moveMcq = (fromIndex, toIndex) => {
        const updatedItems = [...mcqs];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setMcqs(updatedItems);
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId
                    ? {
                        ...item,
                        mcqs: updatedItems.map((updatedItem) => ({
                            id: updatedItem.id,
                            text: updatedItem.text,
                            mcqAns: updatedItem.mcqAns,
                            mcqOptions: updatedItem.mcqOptions
                        }))
                    }
                    : item
            )
        );
    };

    // Text Editor
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
    ];

    const handleChange = (value) => {
        setEditorValue(value);
        switch (type) {
            case 'cloze':
                const matches = value.match(/<u>(.*?)<\/u>/g);
                let underlinedWords;

                if (matches) {
                    underlinedWords = matches.map(match => {
                        const wordMatch = /<u>(.*?)<\/u>/g.exec(match);
                        return wordMatch[1];
                    });

                    underlinedWords.forEach(word => {
                        const blankId = uuidv4();

                        const isWordPresent = blanks.find(item => item.element.props.children.props.text === word);

                        if (!isWordPresent) {
                            setBlanks(prevItems => [...prevItems, { id: blankId, text: word, removable: false, element: <span><TextElement text={word} id={blankId} type={'blank'} deleteItem={deleteItem} delteIcon={false} /></span> }]);
                            setForm((prevItems) =>
                                prevItems.map((item) =>
                                    item.id === questionId
                                        ? {
                                            ...item,
                                            options: Array.isArray(item.options)
                                                ? [...item.options, { id: blankId, text: word, removable: false }]
                                                : [{ id: blankId, text: word, removable: false }],
                                        }
                                        : item
                                )
                            );
                        }
                    });
                }

                const removedWords = (prevUnderlinedWords || []).filter(word => !underlinedWords?.includes(word));

                removedWords?.forEach(removedWord => {
                    const removedWordItem = blanks.find(item => item.element.props.children.props.text === removedWord);

                    if (removedWordItem) {
                        setBlanks(prevItems => prevItems.filter(item => item !== removedWordItem));
                        setForm((prevItems) =>
                            prevItems.map((item) => {
                                if (item.id === questionId && Array.isArray(item.options)) {
                                    const updatedOptions = item.options.filter(item2 => {
                                        return item2.text !== removedWordItem.element.props.children.props.text;
                                    });
                                    return {
                                        ...item,
                                        options: updatedOptions,
                                    };
                                }
                                return item;
                            })
                        );

                    }
                });

                setPrevUnderlinedWords(underlinedWords || []);

                let htmlText = value.replace(/<u>(.*?)<\/u>/g, (_, word) => '_'.repeat(word.length));
                const plainText = new DOMParser().parseFromString(htmlText, 'text/html').body.textContent;
                setpreviewValue(plainText);
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId ? { ...item, plainText, value } : item
                    )
                );
                break;
            case 'comprehension':
                setForm((prevItems) =>
                    prevItems.map((item) =>
                        item.id === questionId ? { ...item, value } : item
                    )
                );
                break;

            default:
                break;
        }

    };

    const handleFileUpload = (value) => {
        setUploadedFile(value);
        setForm((prevItems) => prevItems.map((item) =>
            item.id === questionId ? { ...item, img: value } : item
        ))
    };

    const handleMCQOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleDesc = (description) => {
        setDescription(description);
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId ? { ...item, description } : item
            )
        );
    };

    const handlePoints = (points) => {
        setPoints(points);
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId ? { ...item, points } : item
            )
        );
    };

    const handleOptionChange = (id, option) => {
        setMcqs((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        mcqAns: option.id
                    }
                    : item
            )
        );
        setForm((prevItems) =>
            prevItems.map((item) =>
                item.id === questionId
                    ? {
                        ...item,
                        mcqs: item.mcqs.map((item2) =>
                            item2.id === id
                                ? {
                                    ...item2,
                                    mcqAns: option.id
                                }
                                : item2
                        ),
                    }
                    : item
            )
        );

    }

    return (
        <div className='col-md-10'>
            <Card className="rounded">
                <Card.Body className="d-flex justify-content-between flex-wrap p-4">
                    <div className="col-md-12">
                        <div className='d-flex justify-content-between align-items-center'>
                            <h4 className="card-title mx-1 col-md-6">Question</h4>
                            {type === 'categorize' ?
                                (
                                    <div className='d-flex'>
                                        <i className='mx-2'>Categorize</i>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="tooltip-categorize">Users match items in one column to corresponding categories in another, simplifying the organization of information based on specific criteria</Tooltip>}
                                        >
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="#002147" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></svg>

                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                )
                                :
                                type === 'cloze' ?
                                    (
                                        <div className='d-flex'>
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
                                    )
                                    :
                                    (
                                        <div className='d-flex'>
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
                                    )
                            }
                        </div>
                        <div className='row mb-5'>
                            <div className='mt-2 col-md-5'>
                                <input value={description} onChange={(event) => handleDesc(event.target.value)} type="email" class="form-control" placeholder='Description (optional)' aria-describedby="emailHelp" />
                            </div>
                            <div className='mt-2 col-md-4 d-flex align-items-center'>
                                <h6>Upload Image</h6>
                                <label htmlFor="file-upload" className="sr-only">
                                    Upload Image
                                </label>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={(event) => handleFileUpload(event.target.files[0])}
                                />
                                <Button
                                    className='mx-2'
                                    variant={uploadedFile ? 'success' : 'primary'}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                </Button>
                            </div>

                            <div className='mt-2 col-md-3'>
                                <input value={points} onChange={(event) => handlePoints(event.target.value)} type="number" class="form-control" placeholder='Points' aria-describedby="emailHelp" />
                            </div>
                        </div>

                        {type === 'categorize' ?
                            (
                                <div>
                                    <h5 className="card-title mt-4 mb-2 ">Categories</h5>
                                    <div>
                                        <div className='col-md-7'>
                                            {items.map((item, index) => (
                                                <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveItem} />
                                            ))}
                                        </div>
                                        <span className='d-flex align-items-center'>
                                            <div className='mt-2 col-md-3'>
                                                <input value={newItem} onChange={(event) => setNewItem(event.target.value)} type="text" className="form-control text-center" placeholder='Add New' aria-describedby="emailHelp" />
                                            </div>
                                            <span onClick={() => additem('item')}><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" /></svg></span>
                                        </span>
                                    </div>

                                    <div className='d-flex card-title mt-4'>
                                        <h5 className="col-md-5 mx-2">Items</h5>
                                        {ans.length > 0 ?
                                            (
                                                <h5>Belongs to</h5>
                                            )
                                            :
                                            (<></>)
                                        }
                                    </div>
                                    <div className='d-flex col-md-12 mb-5'>
                                        <div className='col-md-12'>
                                            <div className='col-md-12'>
                                                {ans.map((item, index) => (
                                                    <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveAns} />
                                                ))}
                                            </div>
                                            <span className='d-flex align-items-center'>
                                                <div className='mt-2 col-md-3'>
                                                    <input value={newAns} onChange={(event) => setNewAns(event.target.value)} type="text" className="form-control text-center" placeholder='Add New' aria-describedby="emailHelp" />
                                                </div>
                                                <span onClick={() => additem('ans')}><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" /></svg></span>
                                            </span>
                                        </div>
                                        <div className='col-md-6'>
                                            <div>
                                                {cat.map((item, index) => (
                                                    <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveCat} />
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            type === 'cloze' ?
                                (
                                    <div>
                                        <div>
                                            <h5 className="card-title mt-4 mb-2 ">Preview</h5>
                                            <div className='mt-2 col-md-12'>
                                                <input type="text" value={previewValue} class="form-control" placeholder='Preview' aria-describedby="emailHelp" />
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="card-title mt-4 mb-2 ">Sentence</h5>
                                            <div className='mt-2 col-md-12'>
                                                {/* <input type="yexy" class="form-control" placeholder='Underline the words here to convert them into blanks' aria-describedby="emailHelp" /> */}
                                                <ReactQuill
                                                    value={editorValue}
                                                    onChange={handleChange}
                                                    modules={modules}
                                                    formats={formats}
                                                    placeholder='Underline the words here to convert them into blanks'
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-12 mt-3'>
                                            <h5>Options</h5>
                                            <div className='col-md-7'>
                                                {blanks.map((item, index) => (
                                                    <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveBlanks} />
                                                ))}
                                            </div>
                                            <span className='d-flex align-items-center'>
                                                <div className='mt-2 col-md-3'>
                                                    <input value={newBlank} onChange={(event) => setNewBlank(event.target.value)} type="text" className="form-control text-center" placeholder='Add New' aria-describedby="emailHelp" />
                                                </div>
                                                <span onClick={() => additem('blank')}><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" /></svg></span>
                                            </span>
                                        </div>


                                    </div>
                                )
                                :
                                type === 'comprehension' ?
                                    (
                                        <div>
                                            <div>
                                                <div className='mt-2 col-md-12'>
                                                    {/* <input type="yexy" class="form-control" placeholder='Underline the words here to convert them into blanks' aria-describedby="emailHelp" /> */}
                                                    <ReactQuill
                                                        value={editorValue}
                                                        onChange={handleChange}
                                                        modules={modules}
                                                        formats={formats}
                                                        placeholder='Underline the words here to convert them into blanks'
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-12 mt-3'>
                                                <h5>MCQ</h5>

                                                <Card>
                                                    <Card.Body className="d-flex justify-content-between flex-wrap">
                                                        <div className='col-md-12'>
                                                            {mcqs?.map((item, index) => (
                                                                <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveMcq} />
                                                            ))}
                                                        </div>
                                                        <div className="col-md-12 mt-4">
                                                            <h6> Add New Question</h6>
                                                            <div className='mt-2 col-md-12'>
                                                                <input value={newMcqQuestion} onChange={(event) => setnewMcqQuestion(event.target.value)} type="text" className="form-control text-center" placeholder='Add Question' aria-describedby="emailHelp" />
                                                            </div>
                                                            <h6 className='mt-3'>Add Options</h6>
                                                            <div className='col-md-12'>
                                                                {mcqsOptions?.map((item, index) => (
                                                                    <DraggableItem key={item.id} id={item.id} element={item.element} index={index} moveItem={moveMcqOptions} />
                                                                ))}
                                                            </div>
                                                            <div className='d-flex align-items-center'>
                                                                <div className='mt-2 col-md-11'>
                                                                    <input value={newMcqOption} onChange={(event) => setnewMcqOption(event.target.value)} type="text" className="form-control text-center" placeholder='Add Options' aria-describedby="emailHelp" />
                                                                </div>
                                                                <div className=''>
                                                                    <span onClick={() => additem('mcqOption')}><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" /></svg></span>
                                                                </div>
                                                            </div>
                                                            <div className='d-flex mt-5 justify-content-end'>
                                                                <span onClick={() => additem('mcq')}><Button className='primary'>Add</Button></span>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>


                                        </div>
                                    )
                                    :
                                    (
                                        <></>
                                    )
                        }
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FormEditor;
