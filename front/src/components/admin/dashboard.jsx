import { useState,useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
//import hooks
import Ads from './routes/Ads'
import Users from './routes/users'
import Requests from './routes/requests'
import Comments from './routes/Comments'
import Notes from './routes/notes'
import   './admin.css'
import { http } from '../axios/axiosGlobal'



function Dashboard() {
    const [hide, setHide] = useState(0)
    const [adsNum, setAdsNum] = useState(null)
    const [usersNum, setUsersNum] = useState(null)
    const [plansNum, setPlansNum] = useState(null)
    //send api call to count ads and users
    const count=async()=>{
        const res=await http.post('panel/count-dashboard');
        //console.log(res.data)
        setAdsNum(res.data.ads)
        setUsersNum(res.data.users)
        setPlansNum(res.data.plans)
    }
    
    //send hideFunc to ads and users to hide dasboard contents
    const hideFunc=(hide)=>{
        setHide(hide)
    }

    useEffect(() => {
        count()
    }, [])


    return (
        <div className='ltr mb-5' >
            <p> Dashboard </p>
            <div className='container-fluid d-flex '>
                <div className='row col-md-12 justify-content-between mb-5 px-0 mx-auto'>
                    <div className='left-dash col-2 bg-dark me-1'>
                        <ul className='list-unstyled py-4'>
                            <li className='pb-2'><Link onClick={()=>{setHide(0)}} to='/dashboard'>Dashboard</Link></li>
                            <li className='pb-2'><Link onClick={()=>{setHide(1)}} to='ads'>Ads</Link></li>
                            <li className='pb-2'><Link onClick={()=>{setHide(1)}} to='users'>Users</Link></li>
                            <li className='pb-2'><Link onClick={()=>{setHide(1)}} to='requests'>Plan requests</Link></li>
                            <li className='pb-2'><Link onClick={()=>{setHide(1)}} to='comments'>Comments</Link></li>
                            <li className='pb-2'><Link onClick={()=>{setHide(1)}} to='notes'>Notes</Link></li>
                        </ul>
                    </div>

     
                    <div className='right-dash col-9  me-1'>
                        <div className='row h-100 justify-content-between '>
                            <Routes>
                               <Route path='ads'  element={<Ads hideFunc={hideFunc}/>} />
                               <Route path='users'  element={<Users hideFunc={hideFunc} />} />
                               <Route path='requests'  element={<Requests hideFunc={hideFunc} />} />
                               <Route path='comments'  element={<Comments hideFunc={hideFunc} />} />
                               <Route path='notes'  element={<Notes hideFunc={hideFunc} />} />
                            </Routes>
                            {!hide && 
                            <div className='data d-flex justify-content-between p-0'>
                                <div className='col-md-3 bg-success show white text-center fs-4'><p>Ads</p> <p>{adsNum}</p></div>
                                <div className='col-md-2 bg-danger show white text-center fs-4'>  <p>Users</p> <p>{usersNum}</p></div>
                                <div className='col-md-4 bg-dark show white text-center fs-4'>  <p>Plan Requests</p> <p>{plansNum}</p></div>
                                <div className='col-md-3 bg-info show white text-center fs-4'>  <p>comments</p></div>
                            </div>
                            }
                        </div>
                    </div>
                    

                </div>
            </div>

           
        </div>
    )
}

export default Dashboard
