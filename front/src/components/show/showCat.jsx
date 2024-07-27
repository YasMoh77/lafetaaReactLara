import { useEffect,useState } from 'react';
import {http} from '../axios/axiosGlobal'
import   './show.css'



const ShowCat=({catId})=>{
   
    const [cats, setCats] = useState('')
    
    const getCat=async(cat)=>{
       //get category name
      const res=await http.get('ads/cat/'+cat);
     //  console.log(res.data.cat)
       setCats(res.data.name)
    }
    
    useEffect(() => { 
      
      getCat(catId);

    }, [catId,getCat])
  
    
    return (
      <p>{cats} </p>
    )
  }
  export default ShowCat
  