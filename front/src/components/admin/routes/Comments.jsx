import {useEffect,useState} from 'react'
import { useNavigate } from 'react-router'
import axios  from 'axios'
import Pagination from '../pagination'


const Comments = () => {
    //get login data
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    //states
    const navigate=useNavigate();
    //states
    const [comments, setComments] = useState([])
    const [loadComments, setLoadComments] = useState(false)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(1)

    //get comments
   const getComments=async()=>{
    setLoadComments(true)
    const res=await axios.get('http://127.0.0.1:8000/api/panel/comments?page='+1/*page*/);
    console.log(res.data)
    //use data to change states
    setCurrentPage(res.data.current_page)
    setLastPage(res.data.last_page)
    setTotal(res.data.total)
    setComments(res.data.data)
    setLoadComments(false)
 }

 //mark row
 const markRow=(ee)=>{
    if( ee.parentElement.style.backgroundColor=='orange'){
        ee.parentElement.style.backgroundColor='white';
    }else{ ee.parentElement.style.backgroundColor='orange' }
  }

  //when pagination number is clicked change currentPage
  const changePageFunc=(page)=>{
    setCurrentPage(page)
   }
  
    useEffect(() => {
        getComments()
    }, [])

    
    return (
        <div className='container-fluid top-cont'>
            {loadComments ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>)
             : comments&& comments.length>0 &&
             (        
            <>
            <p>All comments  ({total})</p>
            <div className='overflow-auto w-100 pb-5 table-user-parent' >
                <table className='mb-5 table-user' >                   
                   <thead className='bg-info fw-bold'>
                        <tr >
                            <td>Id</td>
                            <td>comment</td>
                            <td>Ad</td>
                            <td>Commentor</td>
                            <td>Rating</td>      
                            <td>Ad Owner</td>
                            <td>On</td>                                                        
                            {loginData.admin ==='sup'||loginData.admin ==='own' &&    //only super admin or owner can do actions                      
                            <td>Action</td> 
                            }                      
                        </tr>
                    </thead>

                    <tbody>
                       {  comments.map((e)=>(
                        <tr key={e.c_id}  onClick={(ee)=>{markRow(ee.target);}}  >
                            <td>{e.c_id}</td>
                            <td>{e.c_text}</td>
                            <td>{e.ITEM_ID}</td>
                            <td>{e.commentor}</td>
                            <td>{e.rate}</td>
                            <td>{e.owner}</td>  
                            <td>{e.c_date}</td>  
                            <td>
                                {/* block user */}
                                                            
                            </td>
                                                                               
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            </>

            )}      
        </div>
    )
}

export default Comments
