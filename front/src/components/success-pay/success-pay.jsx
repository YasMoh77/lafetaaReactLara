import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import './success-pay.css'

const SuccessPay = () => {
   const navigate=useNavigate();
   const tameez=JSON.parse(localStorage.getItem('tameez'));
   
  // remove tameez and reload
  const removeTameez=()=>{
    localStorage.removeItem('tameez');
    window.location.reload();
  }
   
  //if tameez removed, go home
   useEffect(() => {
     {!tameez && navigate('http://localhost:3000/profile/profileSigns')}
   }, [])


   return (
        <div className='container-fluid top-add'>
            <div>
            <div className='head-pro w-fit my-4 mx-auto py-2 px-4 w-50 rounded-2 white'><p className='m-0 w-fit mx-auto fs-5 fw-bold'>تمييز لافتة</p></div>
                {
               tameez  && 
                ( 
                <>
                  <p><b>عنوان اللافتة</b>: {tameez.tameezName}</p>
                  <p><b>طريقة الدفع</b>: {tameez.tameezPay=='vodafone' ? 'فودافون كاش' : 'حوالة بنكية'}</p>
                  <p><b>باقة التمييز المطلوبة</b>: {tameez.tameezPlan==1 ? 'باقة ذهبية' : 'باقة فضية'}</p>
                  <p><b>رقم التليفون</b>: {tameez.tameezPhone}</p>
                  <p> <b>المبلغ</b>: {tameez.tameezPrice}</p>
                  
                    {/* if methodPay is vodafone cash */}
                  {tameez.tameezPay=='vodafone'&& 
                  <>
                    <div className='w-fit mx-auto mt-5 bg-info py-2 px-4'>
                        <p>ارسل المبلغ الى رقم (01013632800)  </p> 
                        <p> على فودافون كاش </p> 
                        <p> ثم ارسل سكرين شوت الى نفس الرقم على واتس اب</p> 
                    </div>
                  </>
                  }
                  
                   {/* if methodPay is bank */}
                  {tameez.tameezPay=='bank'&& 
                  <>
                     <div className='w-fit mx-auto mt-5 bg-info py-2 px-4'>
                        <p>ارسل المبلغ الى حساب رقم (01013632800) </p>
                        <p><b>الاسم</b>: ياسر سيد محمد</p>
                        <p><b>البنك</b>: أبو ظبي الاسلامي - فرع قنا</p>
                     </div>
                   </>
                   }
                    <button onClick={removeTameez} className='w-25 mx-auto mt-3 mb-5 bg-success py-2 px-4 d-block border-0 white'>موافق</button>


                 </>
                )
                
                }
            </div>
        </div>
    )
}

export default SuccessPay
