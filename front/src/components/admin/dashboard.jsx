import { useState,useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Ads from './Ads'
import Users from './users'
import Requests from './requests'
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
        console.log(res.data)
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
        <div className='container-fluid vh-100 ltr mb-5' >
            <p> Dashboard </p>
            <div className='container-fluid d-flex vh-100'>
                <div className='row col-md-12 justify-content-between mb-5'>
                    <div className='child-one-dash bg-info me-1'>
                        <ul className='list-unstyled'>
                            <li><Link onClick={()=>{setHide(0)}} to='/dashboard'>Dashboard</Link></li>
                            <li><Link onClick={()=>{setHide(1)}} to='ads'>Ads</Link></li>
                            <li><Link onClick={()=>{setHide(1)}} to='users'>Users</Link></li>
                            <li><Link onClick={()=>{setHide(1)}} to='requests'>Plan requests</Link></li>

                            <li>Notes</li>

                        </ul>
                    </div>

     
                    <div className='container child-two-dash  me-1'>
                        <div className='row h-100 justify-content-between'>
                            <Routes>
                               <Route path='ads'  element={<Ads hideFunc={hideFunc}/>} />
                               <Route path='users'  element={<Users hideFunc={hideFunc} />} />
                               <Route path='requests'  element={<Requests hideFunc={hideFunc} />} />
                            </Routes>
                            {!hide && 
                            <>
                                <div className='col-md-3 h-75 bg-success show white text-center'><p className='fs-2'>Ads</p> <p className='fs-3 '>{adsNum}</p></div>
                                <div className='col-md-3 h-75 bg-danger show white text-center'>  <p className='fs-2'>Users</p> <p className='fs-3 '>{usersNum}</p></div>
                                <div className='col-md-3 h-75 bg-dark show white text-center'>  <p className='fs-3'>Plan Request</p> <p className='fs-3 '>{plansNum}</p></div>
                                <div className='col-md-3 h-75 bg-info show white text-center'>  Messages</div>
                            </>
                            }
                        </div>
                    </div>
                    

                </div>
            </div>

           
        </div>
    )
}

export default Dashboard
