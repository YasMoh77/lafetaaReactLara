import { useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import   './show.css'
import {http} from '../axios/axiosGlobal'

const ShowSaved = ({id,isSaved }) => {

    const loginData=JSON.parse(localStorage.getItem('loginData'));
    const userEmail=loginData.email;
    //save ad
    const [savedAd, setSavedAd] = useState(isSaved ? 'red' : 'gray');
    const refI = useRef()      

   //save ads
    const saveFunc=async(id)=>{
        refI.current.classList.toggle('red') 

        const res=await http.post('/save',{id,userEmail});
        if(res.data.message=='saved'){
            setSavedAd('red')
        }else{
            setSavedAd('gray')
        }
    }


  return (
    <>
      {
        loginData ? 
        (
            <i ref={refI} id={id} onClick={(e) => saveFunc(e.target.id)} className={`bi bi-heart align-self-center ${savedAd}`} ></i>
        ) : (
            <Link to='/login'> <i className='bi bi-heart align-self-center'></i> </Link>
        )
      }
    </>
  );

}


export default ShowSaved
