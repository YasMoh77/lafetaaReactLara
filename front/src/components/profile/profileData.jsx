import { useNavigate } from 'react-router-dom';
import './profile.css'


const ProfileData = () => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    return (
        <div className='profData-div py-3 px-2'>
            <p> الاسم : {loginData.name}</p>
            <p> البريد الالكتروني : {loginData.email}</p>
        </div>
    )
}

export default ProfileData

///////////////


