import {useState,useEffect,useRef } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { http,httpFile } from '../axios/axiosGlobal'
import './add.css'

const Add = () => {
    //values
    const [cats, setCats] = useState([])
    const [subCats, setSubCats] = useState([])
    const [conts, setConts] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [responseOk, setResponseOk] = useState()
    const [responseError, setResponseError] = useState('')
    const [loadingAdd, setLoadingAdd] = useState(false)
    //navigate
    const navigate=useNavigate();
    // form values
    const title = useRef('')
    const refSmall = useRef('')
    const country = useRef('')
    const state = useRef('')
    const city = useRef('')
    const cat = useRef('')
    const sub = useRef('')
    const photo = useRef('')
    //additional values
    const refPhone = useRef('')
    const refWhats = useRef('')
    const refEmail = useRef('')
    const refWeb = useRef('')
    const refYoutube = useRef('')

    //get cat and country on page load
    useEffect(() => {
        getCats();
        getCountries();
    }, [])
     
    //get cats 
    const getCats=async()=>{
        const res=await http.post('/cats');
        setCats(res.data)
    }

    //get subcats
    const getSubCats=async(id)=>{
        const res=await http.post('/subcats',{id});
        setSubCats(res.data)
    }
    //get countries
    const getCountries=async()=>{
        const res=await http.post('/conts');
        setConts(res.data)
    }

    //get states
    async function getStates(cont){
     //fetch states
    const res=  await http.post('/states',{cont});
    setStates(res.data);
    }
 
   //get states
   async function getCities(state){
     //fetch states
    const res=  await http.post('/cities',{state});
    setCities(res.data);
    }
   
    //show form error
    const showError=(field,value,ref)=>{
      if(field==value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
    }
    //show error if title <5 or >40
    const showErrorTitle=(field,ref)=>{
        if(ref===title && (field.length<5 || field.length>40 ) ){ref.current.style.backgroundColor='#e87878'; refSmall.current.style='color:#e87878;font-weight:bold'}else{ref.current.style.backgroundColor='white'; refSmall.current.style='color:initial;font-weight:initial'}
    }


    //regex expresiion
    const reg=/^[0-9]+$/;
    const showErrorPhone=(phone)=>{
        if(!reg.test(phone)){
           refPhone.current.style.backgroundColor='#e87878';
           return 1; //wrong phone number
       }else{
           refPhone.current.style.backgroundColor='white';
           return null; //correct phone number
       }
   }

    //submit add
    const submitAddFunc=async(e)=>{
             e.preventDefault();

        //get values from form
        const loginData=JSON.parse(localStorage.getItem('loginData'));
        const email= loginData && loginData.email;//means user already signed in
        const titleValue=title.current.value.trim();
        const catValue=parseInt(cat.current.value,10);
        const subValue=parseInt(sub.current.value,10);
        const countryValue=parseInt(country.current.value,10);
        const stateValue=parseInt(state.current.value,10);
        const cityValue=parseInt(city.current.value,10);  
        const phone=refPhone.current.value; //
        const photoValue=photo.current.files[0];

        //additional values
        const whats=parseInt(refWhats.current.value,10);
        const web=refWeb.current.value;
        const emailSocial=refEmail.current.value;
        const youtube=refYoutube.current.value;
    // console.log(phone,whats,web,emailSocial,youtube)
        //check if form values are valid
        showError(titleValue,'',title);
        showErrorTitle(titleValue,title);
        showError(catValue,0,cat);
        showError(subValue,0,sub);
        showError(countryValue,0,country);
        showError(stateValue,0,state);
        showError(cityValue,0,city);
        showErrorPhone(phone);
        showError(photoValue,null,photo);
      // console.log(showErrorPhone(phone))
        //store values
        const postData={titleValue,catValue,subValue,countryValue,stateValue,cityValue,photoValue,email,phone,whats,web,emailSocial,youtube}
       
        //send values to backend
        if(titleValue && titleValue.length>=4 && titleValue.length<=40  && catValue>0 && subValue>0 && countryValue>0 && stateValue>0 && phone  && showErrorPhone(phone)==null &&  cityValue>0 && photoValue!=null ){
            //console.log('ph='+email,'showerr='+showErrorPhone())

            try{
                setResponseOk('')
                setResponseError('')
                setLoadingAdd(true);
              /*const res= await httpFile.post('/ads/store',postData);
                 //store response
                setResponseOk(res.data.msg)
                setLoadingAdd(false)
                setTimeout(() => {
                   navigate('/');
                }, 3000);*/
            }catch (error) {
                setLoadingAdd(false)
                error.response ? setResponseError(error.response.data.errors) :setResponseError('');
            
            } //end catch
        }else{ //end if
            setResponseOk(<small className='red'> هناك أخطاء بالحقول المشار اليها أعلاه</small>)
        }
        

    }//end submitAddFunc

   

    return (
        <div className='container-fluid top-add'>
            
            <form onSubmit={submitAddFunc} className='mx-auto  form-add rounded-4'>
                 <p className="w-fit mx-auto fw-bold fs-2">أضف لافتـــة </p>
                <div className="input-cont d-flex ">
                    <label htmlFor="title" className="form-label w-25">العنوان</label>
                    <input type="text"  ref={title} className="form-control w-75" id="title" placeholder="أكتب عنوان اللافتة"/>
                </div>
                <small ref={refSmall} className='d-block w-fit mx-auto mb-3' >5 - 40 حرف</small>

                <div className="input-con mb-3 d-flex">
                    <label htmlFor="cat" className="form-label w-25 ">التصنيف</label>
                    {!cats 
                     ?<div className='w-2 mx-auto w-fit'><p className='spinner-border '></p></div>
                     :<select ref={cat} onChange={(e)=>{getSubCats(e.target.value)}}  className="form-select w-75" id='cat' aria-label="Default select example">
                        <option value='0'> اختر تصنيف</option>
                        {cats&& cats.length>0 
                           ? cats.map((e,index)=> <option key={index} value={e.cat_id}>{e.nameAR}</option>)
                           : 'no cats'
                        }
                     </select>   
                    }
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="sub" className="form-label w-25">التصنيف الفرعي</label>
                    {!subCats 
                     ?<div className='w-2 mx-auto w-fit'><p className='spinner-border '></p></div>
                     :<select ref={sub} className="form-select w-75" id='cat' aria-label="Default select example">
                        <option value='0'> اختر تصنيف فرعي </option>
                        {subCats&& subCats.length>0 
                           ? subCats.map((e,index)=> <option key={index} value={e.subcat_id}>{e.subcat_nameAR}</option>)
                           : 'no subcats'
                        }
                     </select>
                    }
                    
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="country" className="form-label w-25">الدولة</label>
                    <select ref={country} onChange={(e)=>{getStates(e.target.value);setCities('');  }} className="form-select w-75" id='country' aria-label="Default select example">
                        <option value='0'>اختر دولة</option>
                        {conts&& conts.length>0 ? conts.map((e,index)=>(
                             <option key={index} value={e.country_id}>{e.country_nameAR}</option>
                        )) : 'no countries'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="state" className="form-label w-25">المحافظة</label>
                    <select ref={state} onChange={(e)=>{getCities(e.target.value)}} className="form-select w-75" id='state' aria-label="Default select example">
                        <option value='0'>اختر محافظة</option>
                        {states&& states.length>0 ? states.map((e,index)=>(
                             <option key={index} value={e.state_id}>{e.state_nameAR}</option>
                        )) : 'no states'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="city" className="form-label w-25">المدينة</label>
                    <select ref={city} className="form-select w-75" aria-label="Default select example" id='city'>
                        <option value='0'>اختر مدينة</option>
                        {cities&& cities.length>0 ? cities.map((e,index)=>(
                             <option key={index} value={e.city_id}>{e.city_nameAR}</option>
                        )) : 'no cities'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex">
                        <label htmlFor="phone" className="form-label w-25">تليفون محمول </label>
                        <input type="text" id='phone' ref={refPhone}  className="form-control w-75" placeholder='أدخل رقم المحمول' />
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="photo" className="form-label w-25">أضف صورة</label>
                    <input type="file" id='photo' ref={photo} className="form-control w-75"  />
                </div>

               

               <div className='bg-secondary py-4 my-5 ps-2 rounded-2'>
                    <p className='w-fit mx-auto fs-4 fw-bold'>حقول اختيارية</p>
                    <div className="input-cont d-flex pe-2">
                        <label htmlFor="whats" className="form-label w-25"> واتس اب </label>
                        <input type="text" id='whats' ref={refWhats} className="form-control" placeholder=' أدخل رقم واتساب مع رمز الدولة' />
                    </div>
                    <small className='d-block w-fit mx-auto mb-3' >مثال: 201012345678</small>

                    <div className="input-cont d-flex pe-2">
                        <label htmlFor="web" className="form-label w-25">موقع الكتروني </label>
                        <input type="text" id='web' ref={refWeb} className="form-control" placeholder='  أدخل رابط موقعك الالكتروني' />
                    </div>
                    <small className='d-block w-fit mx-auto mb-3' > يبدأ بـ https://www  أو http://www</small>

                    <div className="input-cont d-flex pe-2">
                        <label htmlFor="email" className="form-label w-25">بريد الكتروني </label>
                        <input type="text" id='email' ref={refEmail} className="form-control" placeholder='أدخل بريدك الالكتروني' />
                    </div>
                    <small className='d-block w-fit mx-auto mb-3' >مثال: example@gmail.com</small>

                    <div className="input-cont d-flex pe-2">
                        <label htmlFor="youtube" className="form-label w-25">قناة يوتيوب  </label>
                        <input type="text" id='youtube' ref={refYoutube} className="form-control" placeholder=' أدخل رابط قناتك على توتيوب' />
                    </div>
                    <small className='d-block w-fit mx-auto mb-3' > يبدأ بـ https://www  أو http://www</small>
                </div>

                <button type="submit" className="btn btn-primary mx-auto w-25 d-flex justify-content-center align-items-center">{loadingAdd ? <span className='spinner-border gray '></span>:'أرسل'}</button>
                {responseOk && (<p className="w-fit mx-auto mt-4 fw-bold">{responseOk}</p>) }              
               {responseError && Object.keys(responseError).map((key)=>(
                   <div className='mt-3 '>
                       {responseError[key].map((e)=>(
                          key=='phone' ? <p className='mb-0 mx-auto w-fit red'>'تليفون محمول' : {e}</p>: key=='youtube'?<p className='mb-0 mx-auto w-fit red'>'قناة يوتيوب' : {e}</p>:key=='web'?<p className='mb-0 mx-auto w-fit red'>'موقع الكتروني' : {e}</p> :key=='whats'?<p className='mb-0 mx-auto w-fit red'>'واتس اب' : {e}</p>:<p className='mb-0 mx-auto w-fit red'>' بريد الكتروني' : {e}</p>
                       ))}
                   </div>
               ))  }
            </form>

        </div>
    )
}

export default Add
