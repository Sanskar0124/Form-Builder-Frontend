import React from 'react'
import axios from 'axios'

export default async function UnAuthorizedApiRequest({ endpoint, type, body = null }) {
    try {
        let data
        switch (type) {
            case 'get':
                data = await axios.get(`http://localhost:5000${endpoint}`)
                break;

            case 'post':
                data = await axios({
                    method: 'post',
                    url: `http://localhost:5000${endpoint}`,
                    headers: {},
                    data: body
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
