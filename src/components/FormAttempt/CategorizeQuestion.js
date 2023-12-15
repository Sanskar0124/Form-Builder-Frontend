import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { OverlayTrigger, Tooltip, Dropdown, Button } from 'react-bootstrap';
import Card from '../card'

const Word = ({ id, text, index, moveWord }) => {
    const [, drag] = useDrag({
        type: 'WORD',
        item: { id, index },
    });

    return (
        <div className='text-center my-2 col-md-3 px-3 d-flex align-items-center justify-content-center' ref={drag} style={{ border: '1px solid grey', margin: '4px', padding: '4px', borderRadius: 6, cursor: 'move' }}>
            {text}
        </div>
    );
};

const Catalog = ({ name, words, index, moveWord }) => {
    const [, drop] = useDrop({
        accept: 'WORD',
        drop: (item) => {
            moveWord(item.index, index);
        },
    });

    return (
        <div className='text-center' ref={drop} style={{ border: '2px dashed grey', padding: '8px', margin: '8px' }}>
            <h6><i>{name}</i></h6>
            <div className='d-flex flex-wrap'>
                {words.map((word, index) => (
                    <Word key={word.id} {...word} index={index} />
                ))}
            </div>
        </div>
    );
};

const CategorizeQuestion = ({ ans, cat, description }) => {

    useEffect(() => {
        setWords(ans)
        let temCat = []
        for (let i = 0; i < cat.length; i++) {
            temCat.push({ id: cat[i].id, name: cat[i].text, words: [] })
        }
        setCatalogs(temCat)
    }, [])


    const [words, setWords] = useState([]);

    const [catalogs, setCatalogs] = useState([
        { name: 'Fruits', words: [] },
        { name: 'Colors', words: [] },
    ]);

    const moveWord = (fromIndex, toCatalogIndex) => {
        const movedWord = words[fromIndex];

        setWords((prevWords) => {
            const updatedWords = prevWords.filter((_, index) => index !== fromIndex);
            return updatedWords;
        });

        setCatalogs((prevCatalogs) => {
            const updatedCatalogs = [...prevCatalogs];
            const toCatalog = updatedCatalogs[toCatalogIndex];

            // Check if the item object has an 'id' property before using it
            if (movedWord && movedWord.id && toCatalog) {
                const updatedToCatalog = {
                    ...toCatalog,
                    words: [...toCatalog.words, movedWord],
                };

                updatedCatalogs[toCatalogIndex] = updatedToCatalog;
            }

            return updatedCatalogs;
        });
    };


    return (
        <div className='my-5'>
            <Card>
                <Card.Body>
                    <div className='d-flex justify-content-end'>
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
                    </div>
                    <div>
                        <h5>Words</h5>
                        <div className='d-flex flex-wrap'>
                            {words.map((word, index) => (
                                <Word key={word.id} {...word} index={index} moveWord={moveWord} />
                            ))}
                        </div>
                    </div>

                    <div className='mt-3'>
                        <h5>Catalogs</h5>
                        {catalogs.map((catalog, index) => (
                            <Catalog key={index} {...catalog} index={index} moveWord={moveWord} />
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
};

export default CategorizeQuestion;
