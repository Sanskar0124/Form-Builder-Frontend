import React, { useEffect } from 'react'
import Card from '../card'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function TextElementWithDD({ catOptions, id, text, ansId, storeAns, type, catId, deleteItem }) {
    useEffect(() => {
        console.log("catOptions in TextElementWithDD:", catOptions);
    }, [catOptions]);

    return (
        <div className='d-flex align-items-center' style={{ cursor: 'move' }}>
            <div className='d-flex align-items-center col-md-12' style={{ borderRadius: 6, textAlign: 'center' }}>
                <div className='d-flex align-items-center col-md-5'>
                    <div className='col-md-7 px-3 py-2' style={{ border: 'solid 1px grey', borderRadius: 6, textAlign: 'center' }}>
                        <span>{text}</span>
                    </div>
                    <span onClick={() => deleteItem(id, type, catId)}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" /></svg>
                    </span>
                </div>
                <Dropdown className="col-md-3" options={catOptions} onChange={(item) => storeAns(item.value, item.label, ansId, text)} placeholder=" Select" />
            </div>
            {/* <span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" /></svg>
            </span> */}
        </div>
    )
}
