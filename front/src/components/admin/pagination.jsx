import React from 'react'
import './admin.css'


const Pagination = ({currentPage,lastPage,changePageFunc}) => {
     const pages=[];
     for(let i=1; i<=lastPage;i++){
         pages.push(i);
     }

    return (
        <div className='pagination'>          
            {pages.map((page)=>(
                <button key={page} onClick={()=>{changePageFunc(page)}}> {page==currentPage? <span className='red fw-bold fs-5'>{page}</span> : <span className='white'>{page}</span>}  </button>              
            ))}             
        </div>
        
    )
}

export default Pagination
