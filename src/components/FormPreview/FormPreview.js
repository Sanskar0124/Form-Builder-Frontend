// client/src/components/FormPreview/FormPreview.js
import React from 'react';

const FormPreview = ({ formTitle, headerImage, questions }) => {
    return (
        <div>
            <h2>{formTitle}</h2>

            {headerImage && <img src={headerImage} alt="Header" style={{ maxWidth: '300px' }} />}

            <form>
                {questions.map((question) => (
                    <div key={question.id}>
                        <label>{question.text}</label>
                        {question.image && <img src={question.image} alt="Question" style={{ maxWidth: '100px' }} />}
                        <input type="text" placeholder="Answer here" />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FormPreview;
