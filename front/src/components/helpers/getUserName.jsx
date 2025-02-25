import React,{useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const GetUserName = ({id}) => {
    //state
    const [name, setName] = useState('')
    const getTheName=async(id)=>{
        //send api
        const res= await http.post(`/get-user-name/${id}`)
        setName(res.data.name)

    }

    useEffect(() => {
        getTheName(id)
    }, [id])

    return (
       name&&<span>{name}</span>
    )
}

export default GetUserName
