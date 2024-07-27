import {useEffect} from 'react'
import {Link, Routes,Route} from 'react-router-dom'
import { useNavigate } from 'react-router';
import ProfileSigns from './profileSigns';
import ProfileData from './profileData';

import './profile.css'

//get login data
const loginData=JSON.parse(localStorage.getItem('loginData'));

const Profile = () => {

 const navigate=useNavigate();

//go to login if not logged in
useEffect(() => {
    if(!loginData){
        navigate('/login');
    }
}, [navigate])

//confirm if need to lo gout
const confirmLogOut=()=>{
    return window.confirm('هل ترغب في تسجيل الخروج ؟ ');
}

//remove stored user data if logged out
const DologOut=()=>{
    if(confirmLogOut()){
        localStorage.removeItem('loginData');
        navigate('/');
        window.location.reload();
    }
}
//////////////////////////////

    return (
        <div className='container-fluid min-vh-100'>
           <div className='mb-5'>
               <i className='bi bi-house-fill'></i> <span>حسابي</span>
           </div>
            {
                (loginData &&
                    //user is logged in
                    (<div>
                           <div className='d-flex bg-primary py-3 px-2 align-items-center prof-head'>
                            <Link to='profileData' className='ms-5 mb-0' >بياناتي</Link>
                            <Link  to='profileSigns'  className='ms-5 mb-0'>لافتاتي</Link>
                            <a onClick={confirmLogOut}  className='ms-5 mb-0 logout-a' onClick={DologOut} >تسجيل الخروج</a>
                           </div>

                             {/*  routes */}
                            <div>
                                <p className='mt-3 font-weight-bold'>أهلا {loginData.name}</p>
                                <Routes>   
                                    <Route path='profileData' element={<ProfileData/>} />    
                                    <Route path='profileSigns' element={<ProfileSigns/>} />
                                </Routes>
                           </div>
                    </div>)
                     
                   )
                   
            }
        </div>
    )
}

export default Profile
