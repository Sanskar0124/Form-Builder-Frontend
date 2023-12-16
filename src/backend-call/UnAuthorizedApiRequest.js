import React from 'react'
import axios from 'axios'

export default async function UnAuthorizedApiRequest({ endpoint, type, body = null }) {
    try {
        let data
        switch (type) {
            case 'get':
                // data = await axios.get(`http://localhost:5000${endpoint}`)
                data = await axios.get(`https://mernbackendapp-0h0r.onrender.com${endpoint}`)
                break;

            case 'post':
                data = await axios({
                    method: 'post',
                    // url: `http://localhost:5000${endpoint}`,
                    url: `https://mernbackendapp-0h0r.onrender.com${endpoint}`,
                    headers: {},
                    data: body
                })
                break;

            case 'delete':
                data = await axios({
                    method: 'delete',
                    // url: `http://localhost:5000${endpoint}`,
                    url: `https://mernbackendapp-0h0r.onrender.com${endpoint}`,
                    headers: {},
                })
                break;

            default:
                break;
        }
        return data
    } catch (error) {
        //    console.log(error)  
    }
}
