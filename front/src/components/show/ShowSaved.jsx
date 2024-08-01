import { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import   './show.css'
import {http} from '../axios/axiosGlobal'

const ShowSaved = ({id}) => {

    const loginData=JSON.parse(localStorage.getItem('loginData'));
    const userEmail=loginData.email;
    //save ad
    const [savedAd, setSavedAd] = useState('')
    const [checkSaved, setCheckSaved] = useState('')
    const refI = useRef()
        

   //save ads
    const saveFunc=async(id)=>{
        refI.current.classList.toggle('red') 

        const res=await http.post('/save',{id,userEmail});
        if(res.data.message=='saved'){
            setSavedAd('red')
        }else{
            setSavedAd('white')
        }
    }

    const checkFunc=async(id, userEmail)=>{
        //api to check saved or not
        const resSaved= await http.post('/checkSaved',{id,userEmail});
       if(resSaved.data.message=='saved'){
        setCheckSaved('red')
       }else{
        setCheckSaved('white')
       }
        
    }

    
    useEffect(() => {
        checkFunc(id,userEmail)
    }, [])


    return (
         <>
             { loginData ? savedAd && savedAd=='red' || checkSaved && checkSaved=='red' ?  <i ref={refI} id={id} onClick={(e)=>{saveFunc(e.target.id)}} className='bi bi-heart align-self-center red'></i>: <i ref={refI} id={id} onClick={(e)=>{saveFunc(e.target.id)}} className='bi bi-heart align-self-center gray'></i>  : <Link to='/login'><i className='bi bi-heart align-self-center'></i></Link>  }
         </>
    )
}

export default ShowSaved
