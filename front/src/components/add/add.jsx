import {useState,useEffect,useRef } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
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
    //for form
    const title = useRef('')
    const refSmall = useRef('')
    const country = useRef('')
    const state = useRef('')
    const city = useRef('')
    const cat = useRef('')
    const sub = useRef('')
    const photo = useRef('')

    //get cat and country on page load
    useEffect(() => {
        getCats();
        getCountries();
    }, [])
    
    //get cats
    const getCats=async()=>{
        const res=await axios.get('http://127.0.0.1:8000/api/cats');
        setCats(res.data)
    }
    //get subcats
    const getSubCats=async(id)=>{
        const postData={id};
        const res=await axios.post('http://127.0.0.1:8000/api/subcats',postData);
        setSubCats(res.data)
    }
    //get countries
    const getCountries=async()=>{
        const res=await axios.get('http://127.0.0.1:8000/api/conts');
        setConts(res.data)
    }

    //get states
    async function getStates(cont){
    // prepare data to be sent
     const postData={cont};
     //fetch states
    const res=  await axios.post('http://127.0.0.1:8000/api/states',postData);
    setStates(res.data);
    }
 
   //get states
   async function getCities(state){
    // prepare data to be sent
     const postData={state};
     //fetch states
    const res=  await axios.post('http://127.0.0.1:8000/api/cities',postData);
    setCities(res.data);
    }
   
    //show form error
    const showError=(field,value,ref)=>{
      if(field==value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
    }
    //show error if title <5 or >40
    const showErrorTitle=(field,ref)=>{
        if(ref==title && (field.length<5 || field.length>40 ) ){ref.current.style.backgroundColor='#e87878'; refSmall.current.style='color:#e87878;font-weight:bold'}else{ref.current.style.backgroundColor='white'; refSmall.current.style='color:initial;font-weight:initial'}
    }
    

    //submit add
    const submitAddFunc=async(e)=>{
        e.preventDefault();

        //get values from form
        const loginData=JSON.parse(localStorage.getItem('loginData'));
        const email= loginData && loginData.email;
        const titleValue=title.current.value.trim();
        const countryValue=parseInt(country.current.value,10);
        const stateValue=parseInt(state.current.value,10);
        const cityValue=parseInt(city.current.value,10);
        const catValue=parseInt(cat.current.value,10);
        const subValue=parseInt(sub.current.value,10);
        const photoValue=photo.current.files[0];
        
        //check if form values are valid
        showError(titleValue,'',title);
        showErrorTitle(titleValue,title);
        showError(catValue,0,cat);
        showError(subValue,0,sub);
        showError(countryValue,0,country);
        showError(stateValue,0,state);
        showError(cityValue,0,city);
        showError(photoValue,null,photo);

        //store values
        const postData={titleValue,catValue,subValue,countryValue,stateValue,cityValue,photoValue,email}
       
        //send values to backend
        if(titleValue && titleValue.length>=5 && titleValue.length<=40  && catValue>0 && subValue>0 && countryValue>0 && stateValue>0 && cityValue>0 && photoValue!=null ){
            try{

                setResponseOk('')
                setResponseError('')
                setLoadingAdd(true);
                const res= await axios.post('http://127.0.0.1:8000/api/ads/store',postData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    withCredentials:true
                });

                setResponseOk(res.data.msg)
                setLoadingAdd(false)
                navigate('/');
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
                    <label htmlFor="title" className="form-label">العنوان</label>
                    <input type="text"  ref={title} className="form-control" id="title" placeholder="أدخل العنوان"/>
                </div>
                <small ref={refSmall} className='d-block w-fit mx-auto mb-3' >5 - 40 حرف</small>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="cat" className="form-label">التصنيف</label>
                    <select ref={cat} onChange={(e)=>{getSubCats(e.target.value)}} className="form-select" id='cat' aria-label="Default select example">
                        <option value='0'> اختر تصنيف</option>
                        {cats&& cats.length>0 ? cats.map((e,index)=>(
                             <option key={index} value={e.cat_id}>{e.nameAR}</option>
                        )) : 'no cats'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="sub" className="form-label">التصنيف الفرعي</label>
                    <select ref={sub} className="form-select" aria-label="Default select example" id='sub'>
                        <option value='0'> اختر تصنيف فرعي</option>
                        {subCats&& subCats.length>0 ? subCats.map((e,index)=>(
                             <option key={index} value={e.subcat_id}>{e.subcat_nameAR}</option>
                        )) : 'no cats'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="country" className="form-label">الدولة</label>
                    <select ref={country} onChange={(e)=>{getStates(e.target.value);setCities('');  }} className="form-select" id='country' aria-label="Default select example">
                        <option value='0'>اختر دولة</option>
                        {conts&& conts.length>0 ? conts.map((e,index)=>(
                             <option key={index} value={e.country_id}>{e.country_nameAR}</option>
                        )) : 'no countries'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="state" className="form-label">المحافظة</label>
                    <select ref={state} onChange={(e)=>{getCities(e.target.value)}} className="form-select" id='state' aria-label="Default select example">
                        <option value='0'>اختر محافظة</option>
                        {states&& states.length>0 ? states.map((e,index)=>(
                             <option key={index} value={e.state_id}>{e.state_nameAR}</option>
                        )) : 'no states'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="city" className="form-label">المدينة</label>
                    <select ref={city} className="form-select" aria-label="Default select example" id='city'>
                        <option value='0'>اختر مدينة</option>
                        {cities&& cities.length>0 ? cities.map((e,index)=>(
                             <option key={index} value={e.city_id}>{e.city_nameAR}</option>
                        )) : 'no cities'}
                    </select>
                </div>

                <div className="input-cont mb-3 d-flex ">
                    <label htmlFor="photo" className="form-label">أضف صورة</label>
                    <input type="file"  ref={photo} className="form-control"  />
                </div>

                <button type="submit" className="btn btn-primary mx-auto w-fit d-block">أرسل</button>
                {loadingAdd && (<p className='w-fit mt-2 mx-auto'><span className='spinner-border gray '></span></p>)}
                {responseOk && (<p className="w-fit mx-auto mt-4 fw-bold">{responseOk}</p>) }              
               {responseError && Object.keys(responseError).map((key)=>(
                   <div className='mt-3 '>
                       {responseError[key].map((e)=>(
                           <p className='mb-0 mx-auto w-fit red'>{e}</p>
                       ))}
                   </div>
               ))  }
            </form>

        </div>
    )
}

export default Add
