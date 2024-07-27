/*import { useEffect,useState } from 'react';
import {http} from '../axios/axiosGlobal'
import   './show.css'



const ShowSubcat=({subId})=>{
    //get cats
    const [subCats, setSubCats] = useState('')
   
    useEffect(() => {
      const getSub=async(sub)=>{
         const res2=await http.post('ads/sub',{sub});
         setSubCats(res2.data.sub)
      }

      getSub(subId);
    }, [])
  
    
    return (
      <p> <i class="bi bi-chevron-left"></i> {subCats}</p>
    )
  }
  export default ShowSubcat*/
  

import { useEffect, useState, useCallback } from 'react';
import { http } from '../axios/axiosGlobal';
import _ from 'lodash';
import './show.css';

const ShowSubcat = ({ subId }) => {
    const [subCats, setSubCats] = useState('')

  const getSub = useCallback(_.throttle(async (sub) => {
    try {
      const res = await http.get('ads/sub/' + sub);
      setSubCats(res.data.name);
    } catch (error) {
      console.error("Failed to fetch category:", error);
    }
  }, 1000), []); // 1000ms throttle

  useEffect(() => {
    getSub(subId);
    // Clean up throttle on unmount
    return () => {
        getSub.cancel();
    };
  }, [subId, getSub]);

  return (
    <p>{subCats}</p>
  );
}

export default ShowSubcat;
