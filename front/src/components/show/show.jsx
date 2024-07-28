import React, {useRef,useEffect,useState } from 'react';
import {http} from '../axios/axiosGlobal'
import './show.css';
//import '../images/images'


function Show() {
    const refCountry = useRef()
    const refState = useRef()
    const refCity = useRef()
    const refTop = useRef()
    
    //bringLinks 
    const [ads, setAds] = useState([])
    //search
    const [state, setState] = useState([])
    const [city, setCity] = useState([])
    const [result, setResult] = useState([])
    const [free, setFree] = useState('')
    const [adsNum, setAdsNum] = useState('')
    const [div, setDiv] = useState(0)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingSearch, setLoadingSearch] = useState(false)
   // const [loadingState, setLoadingState] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    //loadMore
    const [currentPage, setCurrentPage] = useState(1)
    //enlarge image
    const [enlarge, setEnlarge] = useState('')
    const baseURL='http://127.0.0.1:8000/storage/images/';
        

    useEffect(() => {
        bringLinks();
       // getStates();
    }, []) 

     //get the first 12 items on homepage when page loads
const bringLinks=async()=>{
	setLoading(true);//start loading spinner	
	const res= await http.get('http://127.0.0.1:8000/api/home/123');//fetch data
    setAds(res.data);//store data in ads
    setLoading(false);//end loading spinner
}

//search function
const searchFunc=async(e)=>{
        e.preventDefault();
        //start loading spinner
        setLoadingSearch(true);
        //set current page to 1
        setCurrentPage(1);
        //get values to be sent
        const countryValue=parseInt(refCountry.current.value);
        const stateValue=parseInt(refState.current.value,10);
        const cityValue=parseInt(refCity.current.value,10);
        //store values
        const postData={countryValue,stateValue,cityValue,currentPage}
        //fetch data
        const res= await http.post('http://127.0.0.1:8000/api/search',postData);
        //set values
        setMsg(res.data.msg);
        setFree(res.data.free);
        setAdsNum(res.data.adsNum);
        setDiv(res.data.div);
        setResult(res.data.data);
        //end loading spinner  
        setLoadingSearch(false);
}

//load more ads
const loadMore=async()=>{
    //start loading
    setLoadingMore(true);
    const Page = currentPage + 1;
     //console.log(Page);
     const countryValue=parseInt(refCountry.current.value);
     const stateValue=parseInt(refState.current.value,10);
     const cityValue=parseInt(refCity.current.value,10);
     //store values
     const postData={countryValue,stateValue,cityValue,Page}
     //fetch data
     const res= await http.post('http://127.0.0.1:8000/api/search',postData);
     const newItems = res.data.data;
     // Append new items to existing results
     setResult(prevResults => [...prevResults, ...newItems]);
     //increment currentPage
     setCurrentPage(Page); // Update current page
     setLoadingMore(false);        
}

// enlarge image
const enlargeFun=(src)=>{
    setEnlarge(src)
    document.querySelector('body').style.overflow='hidden';
}
// stop enlarge image
const stopEnlargeFun=()=>{
    setEnlarge('');
    document.querySelector('body').style.overflow='initial';
}

//get states
async function getStates(cont){
   // prepare data to be sent
    const postData={cont};
    //fetch states
    
    try{
   const res=  await http.post('http://127.0.0.1:8000/api/states',postData,{
     withCredentials: true,  // Include credentials in the request
     headers: { 'Content-Type': 'application/json'}
   });
   setState(res.data); 
}catch(error){
    console.error(error)
  }
}


//get cities
async function getCities(state){
    const postData={state};
    const res3= await http.post("http://127.0.0.1:8000/api/cities",postData);
    setCity(res3.data);
}



    return (
          <>
                <div ref={refTop} className="container-fluid top-container">
                       {/** before loading ads show spinner */}
                        {loading? (<span className="spinner-border gray mx-auto d-block"></span>)
                        :( 
                           <>
                                {/** after loading hide spinner and show ads */}
                                <div  className="container-fluid">
                                    <p className="paid"> لافتات مميزة</p>
                                    <div className="row">
                                        <div id="show"  className="d-flex flex-wrap show-wrapper justify-content-space-between col-sm-12">
                                        { ads.map((e,index)=>(<div className='col-xs-12 col-md-4 main'>
                                            <img  onClick={(e)=>{enlargeFun(e.target.src)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                            <div className='pe-1'>{e.NAME}</div>                                            
                                            <div className='featured-icons-div d-flex px-1'>
                                               {e.phone != null ? <a href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a><i class="bi bi-telephone-fill empty"></i></a>} 
                                               {e.whatsapp !=null ? <a href={'https://wa.me/'+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a><i class="bi bi-whatsapp empty"></i></a> } 
                                               {e.website !=null ? <a href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a><i class="bi bi-globe-americas empty"></i></a>} 
                                               {e.item_email !=null ? <a href='mailto:hgq1100@yahoo.com'><i class="bi bi-envelope-at-fill full-env"></i></a> : <a><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                               {e.youtube !=null ? <a href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a><i class="bi bi-youtube empty"></i></a> } 
                                            </div>
                                        </div> )) }
                                        </div>
                                    </div>	
                                </div>

                                {/* enlarge images*/}
                                {enlarge && (<div className="overlay">
                                    <img src={enlarge}  alt="k" /> <i onClick={stopEnlargeFun} className="close-btn bi bi-x-square" ></i>
                                </div>)}
                                
                                <div className="form-parent">
                                    <form onSubmit={searchFunc} id="formSearch" className="mx-auto border py-5 px-5 rounded-3 background-red">
                                        <div className="mx-auto row justify-content-between">
                                            <select ref={refCountry} onChange={ (e)=>{/*setCountry(e.target.value);*/ getStates(e.target.value); } }   name="country"  className="col-xs-12 col-md-4 mb-2" aria-label="Default select example">
                                                <option value="0">اختر دولة</option>
                                                <option value="1"> مصر</option>
                                            </select>

                                            <select ref={refState} onChange={(e)=>{ getCities(e.target.value); }} name="state" id="state" className="col-xs-12 col-md-4 mb-2" aria-label="Default select example">
                                                <option value="0">كل المحافظات</option>
                                                {Array.isArray(state) && state.length > 0 ? state.map((e, index) => (
                                                <option value={e.state_id} key={index}>{e.state_nameAR}</option>
                                                )) : (
                                                <option value="0">لا توجد نتائج</option>
                                                )}
                                            </select>

                                            <select ref={refCity} name="city" id="city" className="col-xs-12 col-md-4 mb-2" aria-label="Default select example">
                                                <option value="0">كل المدن</option>
                                                {Array.isArray(city) && city.length > 0 ? city.map((e, index) => (
                                                <option key={index} value={e.city_id}>{e.city_nameAR}</option>
                                                )) : (
                                                <option value="0">لا توجد نتائج</option>
                                                )}
                                            </select>
                                            <button className="btn searchBtn col-xs-12 " type="submit" >بحث</button>
                                         </div>
                                    </form>
                                </div>
                           </>
                        )}
                        
                        
                        
                            
                        <div  className="container-fluid">
                                {loadingSearch? (
                                 <span className="spinner-border gray mx-auto d-block"></span>
                                ):(
                                   <div className="row">
                                       <p className="free">{free}</p>
                                        <small className="mb-2 d-block"> {adsNum} </small>
                                        <div id="show2"  className="d-flex flex-wrap show-wrapper justify-content-space-between ">
                                            {result&&result.length>0 ?  result.map((e,index)=>(
                                                <div className='col-xs-12 col-md-6 col-lg-4 main2'>
                                                    <img onClick={(e)=>{enlargeFun(e.target.src)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 h-100 mx-auto d-block img'/> 
                                                    <div className='pe-1 mb-2'>{e.NAME}</div>                                            
                                                    <div className='featured-icons-div d-flex px-1'>
                                                    {e.phone != null ? <a href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a><i class="bi bi-telephone-fill empty"></i></a>} 
                                                    {e.whatsapp !=null ? <a href={'https://wa.me/'+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a><i class="bi bi-whatsapp empty"></i></a> } 
                                                    {e.website !=null ? <a href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a><i class="bi bi-globe-americas empty"></i></a>} 
                                                    {e.item_email !=null ? <a href='mailto:hgq1100@yahoo.com'><i class="bi bi-envelope-at-fill full-env"></i></a> : <a><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                    {e.youtube !=null ? <a href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a><i class="bi bi-youtube empty"></i></a> } 
                                                    </div>
                                            </div>
                                             ))   : (<p className="mx-auto"> {msg} </p>) 
                                            }
                                        </div>
                                      {result && result.length>0 ?  div && currentPage<div ? (<button onClick={loadMore} className="btn btn-info w-25 mx-auto" id="loadMore">  {loadingMore ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) : (<span>Load more</span>)} </button>) : (<p className="mx-auto w-fit red">نهاية النتائج</p>) : (<span></span>)}
                                   </div>
                                )}
                                <p className="mx-auto w-fit red mt-5"></p>
                        </div>
                </div>
            
                <script type="text/javascript" src="front/JS/jquery-3.6.0.min.js"></script>	
                <script type="text/javascript" src="front/JS/bootstrap.min.js"></script>	
                <script type="text/javascript" src="front/JS/js.js"></script>	
           </>
        
    )
}

export default Show
