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

    const deleteForm = async (id) => {
        const data = await UnAuthorizedApiRequest({ endpoint: `/forms/${id}`, type: 'delete' })
        if (data.status === 200) {
            setLoading(true)
            fecthForms()
        }
    }

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
                                                <Link className='mx-1' to={`/attempt/${item._id}`}><Button className='btn-warning'>Attempt</Button> </Link>
                                                <Link className='mx-2' to={`/attempt/${item._id}`}><Button className='btn-secondary '>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m16.475 5.408l2.117 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621" /><path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" /></g></svg>
                                                </Button> </Link>
                                                <Button onClick={() => deleteForm(item._id)} className='btn-danger d-flex justify-content-center align-items-center'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z" /></svg>
                                                </Button>
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
