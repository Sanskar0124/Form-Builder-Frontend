import React from 'react'
import Card from '../card'

const TextElement = ({ text, id, deleteItem, type, catId = null, delteIcon = true, isMcqOption = false }) => {
    return (
        <div className='d-flex align-items-center' style={{ cursor: 'move' }}>
            {isMcqOption ?
                (
                    <div className='col-md-11 px-3 py-2' style={{ border: 'solid 1px grey', borderRadius: 6, textAlign: 'center' }}>
                        <span>{text}</span>
                    </div>
                )
                :
                (
                    <div className='col-md-5 px-3 py-2' style={{ border: 'solid 1px grey', borderRadius: 6, textAlign: 'center' }}>
                        <span>{text}</span>
                    </div>
                )
            }
            {delteIcon ?
                (
                    <span onClick={() => deleteItem(id, type, catId)}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" /></svg>
                    </span>
                )
                :
                (
                    <></>
                )
            }
        </div>
    )
}

export default TextElement
