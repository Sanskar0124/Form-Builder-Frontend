import React, { useEffect, useState } from 'react'
import UnAuthorizedApiRequest from '../backend-call/UnAuthorizedApiRequest'
import { Link, useParams, useHistory } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Dropdown, Button } from 'react-bootstrap';

export default function FormList() {
    const [formsList, setFormsList] = useState([])
    const [loading, setLoading] = useState(true)

    const fecthForms = async () => {
        const data = await UnAuthorizedApiRequest({ endpoint: '/forms', type: 'get' })
        setFormsList(data.data || [])
        setLoading(false)
    }

    useEffect(() => {
        fecthForms()
    }, [])

    return (
        <div>
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
                            <h4>Form List</h4>
                            <div className='d-flex align-items-center'>
                                <h5 className='mx-5'>Total: {formsList.length}</h5>
                                <Link to={`/create`}><Button >Add Form</Button></Link>
                            </div>
                        </div >
                        <div className='container my-4'>
                            <ul class="list-group">
                                {formsList.map((item) => (
                                    <li class="list-group-item my-2">
                                        <div className='d-flex justify-content-between align-items-center py-2'>
                                            <div>{item.name}</div>
                                            <div className='d-flex'>
                                                <Link className='mx-2' to={`/attempt/${item._id}`}><Button className='btn-warning'>Attempt</Button> </Link>
                                                <Link to={`/attempt/${item._id}`}><Button className='btn-secondary'>Edit</Button> </Link>
                                            </div>

                                        </div>
                                    </li>
                                ))
                                }
                            </ul>
                        </div>
                    </div >
                )
            }
        </div >
    )
}
