import React, {useRef,useEffect,useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import {Link} from 'react-router-dom'
import {http} from '../axios/axiosGlobal'
import ShowSaved from  './ShowSaved'
import GetCatSubcat from '../helpers/catSubcat';
import GetCountryStateCity from '../helpers/countryStateCity';
import GetUserName from '../helpers/getUserName';
import GetStars from '../helpers/GetStars';
import './show.css';


//this is home page
function Show() {
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    
    //bring featured ads
    const [featured, setFeatured] = useState([])
    //bring latest ads (ordinary not featured)
    const [adsLatest, setAdsLatest] = useState([])
    //search
    const refCountry = useRef()
    const refState = useRef()
    const refCity = useRef()
    const refSearch = useRef('')
    const [state, setState] = useState([])
    const [city, setCity] = useState([])
    const [result, setResult] = useState([])
    const [free, setFree] = useState('')
    const [adsNum, setAdsNum] = useState('')
    const [div, setDiv] = useState(0)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchWord, setSearchWord] = useState('')

    //loadMore
    const [currentPage, setCurrentPage] = useState(1)
    const [savedStatuses, setSavedStatuses] = useState({})
    const refLoadMoreBtn = useRef('')

    //enlarge image
    const [enlarge, setEnlarge] = useState('')
    const baseURL='http://127.0.0.1:8000/storage/images/';

   //check if ad is saved or not
   const checkSavedStatus = async (itemIds, userEmail) => {
        try {
        const res = await http.post('/checkSaved', { itemIds, userEmail });
        // return
        return res.data.message; // Assuming it returns an object like { itemId1: 'saved', itemId2: 'not_saved', ... }
        
        } catch (error) {
        // console.error('Failed to check saved status', error);
        return {};
        }
    };

    
     //get featured ads on homepage when page loads 
   const bringLinks=async()=>{
	setLoading(true);//start loading spinner	
	const res= await http.get('/home');//fetch data
    // Check saved status 
    const bringLinksItems=res.data.featured;
    if (loginData) {
        const itemIds = bringLinksItems.map(e => e.item_id);
        const statuses = await checkSavedStatus(itemIds, loginData.email);
        setSavedStatuses(statuses);  
      }

    setFeatured(res.data.featured);//store data in ads
    setLoading(false);//end loading spinner
  }

  //get newest ads on homepage when page loads
  const bringLatest=async()=>{
    setLoading(true);//start loading spinner	
	const res= await http.get('http://127.0.0.1:8000/api/latest');//fetch data
    // Check saved status 
    const bringLatestItems=res.data;
    if (loginData) {
        const itemIds = bringLatestItems.map(e => e.item_id);
        const statuses = await checkSavedStatus(itemIds, loginData.email);
        setSavedStatuses(statuses);  
      }

    setAdsLatest(res.data);//store data in ads
    setLoading(false);//end loading spinner

  }

useEffect(() => {
    bringLinks();
    bringLatest();
}, []) 


//search function
const searchFunc=async(e)=>{
        e.preventDefault();
        //start loading spinner
        setLoadingSearch(true);
        //set current page to 1
        setCurrentPage(1);
        //get values to be sent
        const countryValue=parseInt(refCountry.current.value,10);
        const stateValue=parseInt(refState.current.value,10);
        const cityValue=parseInt(refCity.current.value,10);
        const search=refSearch.current.value;
        //store values
        const postData={countryValue,stateValue,cityValue,search}
        //fetch data when search form is submitted
        const res= await http.post('/search',postData);
        const broughtAds=res.data.data;
        // Check saved status 
       if (loginData) {
            const itemIds = broughtAds.map(e => e.item_id);
            const statuses = await checkSavedStatus(itemIds, loginData.email);
            setSavedStatuses(statuses);    
       }
        //set values
        setMsg(res.data.msg);
        setFree(res.data.free);
        setAdsNum(res.data.adsNum);
        setDiv(res.data.div);
        setSearchWord(res.data.word)
        setResult(res.data.data);
        //end loading spinner  
        setLoadingSearch(false);
}
   
  
//load more ads
const loadMore=async()=>{
    //start loading
    setLoadingMore(true);
    if(refLoadMoreBtn.current){
        refLoadMoreBtn.current.disabled=true
        refLoadMoreBtn.current.style.cursor='not-allowed'
    }
    const Page = currentPage + 1;
    //get values
     const countryValue=parseInt(refCountry.current.value,10);
     const stateValue=parseInt(refState.current.value,10);
     const cityValue=parseInt(refCity.current.value,10);
     const search=searchWord;
     //store values
     const postData={countryValue,stateValue,cityValue,Page,search}
     //fetch data
     const res= await http.post('http://127.0.0.1:8000/api/search',postData);
     const newItems = res.data.data;
     // Check saved status 
     if (loginData) {
        const itemIds = newItems.map(e => e.item_id);
        const statuses = await checkSavedStatus(itemIds, loginData.email);
        setSavedStatuses(prevStatuses => ({ ...prevStatuses, ...statuses }));  
      }
     // Append new items to existing results
     setResult(prevResults => [...prevResults, ...newItems]);
     //increment currentPage
     setCurrentPage(Page); // Update current page
     setLoadingMore(false);  
     if(refLoadMoreBtn.current){
        refLoadMoreBtn.current.disabled=false 
        refLoadMoreBtn.current.style.cursor='pointer'    
     } 
}


// enlarge image
const enlargeFun=(e)=>{
    setEnlarge(baseURL+e.photo)
    document.querySelector('body').style.overflow='hidden';
}
// stop enlarge image
const stopEnlargeFun=()=>{
    setEnlarge('');
    document.querySelector('body').style.overflow='initial';
}

//show comments
const [showModal, setShowModal] = useState(false)
const [adData, setAdData] = useState([])
const [showComments, setShowComments] = useState([])
const [commentLoader, setCommentLoader] = useState(false)

const commentsFunc=async(e)=>{
    //show modal
    setShowModal(true)
    setAdData(e)
    const id=e.item_id
    //start spinner
    setCommentLoader(true)
    const res=await http.post(`/ads/comments/${id}`)
    setShowComments(res.data.comments)
    setCommentLoader(false)
}

//insert comment
const inputComment = useRef('')
const refBtnSubmitComment = useRef('')
const received = useRef('')

const insertComment=async(e,item,owner)=>{
    e.preventDefault()
    //store value
    const comment=inputComment.current.value
    if(comment.length>0){
        //disable double submission
        refBtnSubmitComment.current.disabled=true
        //if red, restore border normal color
        inputComment.current.style.border='1px solid transparent'
        //send comment to backend
        const email=loginData.email
        const rate=rate5.current.style.color==='orange'?'5':(rate4.current.style.color==='orange')?'4':(rate3.current.style.color==='orange')?'3':(rate2.current.style.color==='orange')?'2':'1'
        console.log(item,owner,rate)
        //send api
        const res=await http.post(`/ads/insert-comment`,{comment,item,owner,rate,email})
        //if comment was inserted
        if(res.data.ok){
            received.current.style.color='green'
            received.current.innerHTML='🗸' 
           //hide modal
            setTimeout(() => {
                setShowModal(false)
            }, 1800);
        }else{
            received.current.style.color='red'
            received.current.innerHTML='☒'
        }     
   }else{
        refBtnSubmitComment.current.disabled=false
        inputComment.current.style.border='1px solid red'
   }
}

//rate ads
const rate1 = useRef(1) 
const rate2 = useRef(2)
const rate3 = useRef(3)
const rate4 = useRef(4)
const rate5 = useRef(5)

const rateFunc=(e)=>{
    //if user rated one star
  if(e===1){
    rate1.current.style.color='orange'
    rate2.current.style.color='initial'
    rate3.current.style.color='initial'
    rate4.current.style.color='initial'
    rate5.current.style.color='initial'
  }else if(e===2){
    rate1.current.style.color='orange'
    rate2.current.style.color='orange'
    rate3.current.style.color='initial'
    rate4.current.style.color='initial'
    rate5.current.style.color='initial'
  }else if(e===3){
    rate1.current.style.color='orange'
    rate2.current.style.color='orange'
    rate3.current.style.color='orange'
    rate4.current.style.color='initial'
    rate5.current.style.color='initial'
  }else if(e===4){
    rate1.current.style.color='orange'
    rate2.current.style.color='orange'
    rate3.current.style.color='orange'
    rate4.current.style.color='orange'
    rate5.current.style.color='initial'
  }else if(e===5){
    rate1.current.style.color='orange'
    rate2.current.style.color='orange'
    rate3.current.style.color='orange'
    rate4.current.style.color='orange'
    rate5.current.style.color='orange'
  }
}

//get states
async function getStates(cont){
    //fetch states
   const res=  await http.post('/states',{cont});
   setState(res.data); 
}


//get cities
async function getCities(state){
    const postData={state};
    const res3= await http.post("http://127.0.0.1:8000/api/cities",postData);
    setCity(res3.data);
}

//get country code for whatsapp
const code=(name)=>{
    if(name==1||name==='مصر'){return '20';} else  if(name==2||name==='السعودية'){return '9660';}
    else  if(name==3||name==='الكويت'){return '9650';} else  if(name==4||name==='الامارات'){return '9710';}
    else  if(name==5||name==='قطر'){return '9740';} else  if(name==6||name==='سلطنة عمان'){return '9680';}
  }

  

    return (
          <>
                <div  className="container-fluid fullheight">
                       {/* show modal for comments */}
                       {showModal && 
                         <>                            
                            {/*<!-- Modal -->*/}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header className='d-flex justify-content-between'>
                                     <Modal.Title>{adData.NAME}</Modal.Title>
                                     <Button variant='white'><i onClick={()=>{setShowModal(false)}} className='bi bi-x-lg text-danger'></i></Button>
                                </Modal.Header>
                                <Modal.Body className='overflow-auto'>
                                    {commentLoader
                                        ?<div className='w-fit mx-auto'><p className='spinner-border text-info'></p></div>
                                        : <>{showComments && Array.isArray(showComments) &&showComments.length>0
                                            ?<>
                                                <p>التعليقات</p>
                                                {showComments.map((e)=>
                                                        <div className='mb-5 p-1 border border-1 rounded-2 bg-light'>
                                                            <div className='d-flex mb-3 '>
                                                                <i className='bi bi-person-circle fs-2 gray ms-3'></i>
                                                                <div>
                                                                    <span><GetUserName id={e.commentor} /> </span>
                                                                    <p>{e.c_date}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <GetStars e={e.rate} />
                                                            </div>
                                                            <div> {e.c_text}</div>
                                                        </div>
                                                )}
                                            </>
                                            :<p>لا توجد تعليقات</p>
                                             }
                                             {loginData
                                             ? 
                                               <div className=''>
                                               <div>
                                                   <i className='bi bi-star' value='1' ref={rate1} onClick={()=>{rateFunc(1)}} ></i> <i className='bi bi-star mx-2' ref={rate2} onClick={()=>{rateFunc(2)}}></i> <i className='bi bi-star' ref={rate3} onClick={()=>{rateFunc(3)}} ></i>
                                                   <i className='bi bi-star mx-2' ref={rate4} onClick={()=>{rateFunc(4)}} ></i> <i className='bi bi-star' ref={rate5} onClick={()=>{rateFunc(5)}} ></i>
                                               </div>
                                               <form onSubmit={(e)=>{insertComment(e,adData.item_id,adData.USER_ID)}} className='mt-3 '>
                                                    <textarea ref={inputComment} placeholder=' اكتب تعليق' className='w-100 p-1 ms-1 ' ></textarea>
                                                    <div className='d-flex'>
                                                        <button ref={refBtnSubmitComment} className='border-0 p-1 bg-success text-white'>أرسل</button>
                                                        <span className='me-2 align-self-center fs-4' ref={received}></span>
                                                    </div>
                                               </form>
                                               </div>
                                             :<Link to='/login'>سجل الدخول لاضافة تعليق</Link>
                                             }

                                             </>
                                            }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                                </Modal.Footer>
                            </Modal>


                         </>
                       }
                       {/** show spinner before featured ads load*/}
                        {loading 
                        ?<div className='d-flex align-items-center justify-content-center minheight'><p className="spinner-border gray mx-auto large-spinner"></p></div>
                        : 
                           <> {/** after loading hide spinner and show featured ads */}
                                { 
                                featured&&Array.isArray(featured)&&featured.length>0&& 
                                <><p className="paid"> لافتات مميزة</p>
                                <div className="row">
                                    <div id="show"  className="d-flex flex-wrap justify-content-between col-sm-12">
                                        {featured.map((e,index)=>
                                            <div className='col-sm-12 col-md-6 main'>
                                                <img  onClick={()=>{enlargeFun(e)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block mb-1'/> 
                                                <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                <div className='pe-1 mb-2 fw-bold text-muted text-truncate'>{e.NAME}</div>                                            
                                                <div className='featured-icons-div d-flex px-1 justify-content-between align-items-center fs-5 fs-md-6'>
                                                    <div>
                                                            {e.phone !== 0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                            {e.whatsapp !==0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                            {e.website !=='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                            {e.item_email !=='' ? <a className='me-3' href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                            {e.youtube !=='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                                    </div>
                                                    <div className='d-flex justify-content-between w-25 gray'>
                                                        <div> 
                                                            <i className={e.rating>1?'bi bi-star text-warning' :'bi bi-star'}></i>
                                                            {e.rating>1 ? e.rating===2||e.rating===3||e.rating===4||e.rating===5?<span className='fs-6 me-1'>{e.rating}.0</span>:<span>{e.rating}</span>:''  }
                                                        </div>
                                                        <div>
                                                            <i onClick={()=>commentsFunc(e)} className={e.comments>0?'bi bi-chat-dots text-success' : 'bi bi-chat-dots'} ></i>
                                                            {e.comments>0&&<span className='fs-6'>{e.comments}</span>}
                                                        </div>
                                                          {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center gray'></i></Link>) }
                                                    </div>
                                                </div>
                                            </div> )
                                        }
                                    </div>
                                </div></>
                                }


                                {/** after loading hide spinner and show latest ads */}
                                <div  className="container-fluid mt-5">
                                    <p className="paid"> أحدث اللافتات </p>
                                    <div className="row">
                                        <div id="show"  className="d-flex flex-wrap justify-content-between col-sm-12">
                                        { adsLatest.map((e,index)=>(<div className='col-sm-12 col-md-4 main2'>
                                            <img  onClick={()=>{enlargeFun(e)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                            <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                            <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                            <div className='pe-1 mb-1 fw-bold text-muted text-truncate'>{e.NAME}</div>                                            
                                            <div className='featured-icons-div d-flex px-1 justify-content-between align-items-center fs-6 fs-md-6'>
                                               <div>
                                                    {e.phone != 0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                    {e.whatsapp !=0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                    {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                    {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                    {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                               </div>
                                               <div className='d-flex justify-content-between gray '>
                                                    <div className='d-flex'>
                                                        <i className={e.rating>1?'bi bi-star text-warning' :'bi bi-star'}></i>
                                                        {e.rating>1 ? e.rating===2||e.rating===3||e.rating===4||e.rating===5?<span className='fs-6 me-1'>{e.rating}.0</span>:<span>{e.rating}</span>:''  }
                                                    </div>
                                                    <div className='d-flex mx-2'>
                                                        <i onClick={()=>commentsFunc(e)} className={e.comments>0?'bi bi-chat-dots text-success' : 'bi bi-chat-dots'} ></i>
                                                        {e.comments>0&&<span className='fs-6'>{e.comments}</span>}
                                                    </div>
                                                    {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center gray'></i></Link>) }
                                               </div>
                                            </div>
                                        </div> )) }
                                        </div>
                                    </div>	
                                </div>
 
                                {/* enlarge images*/}
                                {enlarge && (
                                   <div className="overlay">
                                       <img src={enlarge}  alt="k" /> <i onClick={stopEnlargeFun} className="close-btn hand bi bi-x-square" ></i>
                                   </div>
                                )}
                                
                                {/* search for ads */}
                                <div className="form-parent container-fluid">
                                    <form onSubmit={searchFunc} id="formSearch" className="mx-auto py-5 px-2 rounded-3 col-md-11 col-sm-12">
                                        <div className="mx-auto row justify-content-between d-flex">
                                                <select ref={refCountry} onChange={ (e)=>{/*setCountry(e.target.value);*/ getStates(e.target.value); } }   name="country"  className="col-12 col-sm-12 col-md-4 mb-2" aria-label="Default select example">
                                                    <option value="0">اختر دولة</option>
                                                    <option value="1"> مصر</option>
                                                    <option disabled value="2">السعودية</option>
                                                    <option disabled value="3">الكويت</option>
                                                    <option disabled value="4">الامارات</option>
                                                    <option disabled value="5">قطر</option>
                                                    <option disabled value="6">عمان</option>
                                                </select>

                                                <select ref={refState} onChange={(e)=>{ getCities(e.target.value); }} name="state" id="state" className="col-12 col-sm-12 col-md-4 mb-2" aria-label="Default select example">
                                                    <option value="0"> اختر محافظة</option>
                                                    {Array.isArray(state) && state.length > 0 ? state.map((e, index) => (
                                                    <option value={e.state_id} key={index}>{e.state_nameAR}</option>
                                                    )) : (
                                                    <option value="0">لا توجد نتائج</option>
                                                    )}
                                                </select>

                                                <select ref={refCity} name="city" id="city" className="col-12 col-sm-12 col-md-4 mb-2" aria-label="Default select example">
                                                    <option value="0"> اختر مدينة</option>
                                                    {Array.isArray(city) && city.length > 0 ? city.map((e, index) => (
                                                    <option key={index} value={e.city_id}>{e.city_nameAR}</option>
                                                    )) : (
                                                    <option value="0">لا توجد نتائج</option>
                                                    )}
                                                </select>
                                        
                                                <input type='text' className="btn col-md-10 col-sm-12 mb-2 mb-md-0 mb-sm-0 " ref={refSearch} placeholder='عن أي شيء تبحث؟'  />
                                                <button className="btn  col-md-2 col-sm-12 " type="submit" ><i className='bi bi-search fs-5'></i></button>
                                         </div>
                                    </form>
                                </div>
                           </>
                        }
                        
                        
                        
                         {/* show search results after hitting search button */} 
                        <div  className="container-fluid">
                                {loadingSearch? (
                                 <div className='d-flex justify-content-center minheight'><p className="spinner-border gray mx-auto large-spinner"></p></div>
                                ):(
                                   <div className="row">
                                       <p className="free">{free}</p>
                                        <small className="mb-2 d-block"> {adsNum} </small>
                                        <div id="show2"  className="d-flex flex-wrap justify-content-between ">
                                            {result&&result.length>0 ?  result.map((e,index)=>(
                                                <div className='col-xs-12 col-md-6 col-lg-4 main2'>
                                                    <img onClick={()=>{enlargeFun(e)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                                    <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                    <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                    <div className='pe-1 mb-1 fw-bold text-muted text-truncate'>{e.NAME}</div>                                            
                                                    <div className='featured-icons-div d-flex px-1 justify-content-between align-items-center fs-6 fs-md-6'>
                                                        <div className=''>
                                                            {e.phone != 0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                            {e.whatsapp !=0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                            {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                            {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                            {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                                        </div>
                                                        <div className='d-flex justify-content-between gray'>
                                                            <div className='d-flex'>
                                                                <i className={e.rating>1?'bi bi-star text-warning' :'bi bi-star'}></i>
                                                                {e.rating>1 ? e.rating===2||e.rating===3||e.rating===4||e.rating===5?<span className='fs-6 me-1'>{e.rating}.0</span>:<span>{e.rating}</span>:''  }
                                                            </div>
                                                            <div className='d-flex mx-2'>
                                                                <i onClick={()=>commentsFunc(e)} className={e.comments>0?'bi bi-chat-dots text-success' : 'bi bi-chat-dots'} ></i>
                                                                {e.comments>0&&<span className='fs-6'>{e.comments}</span>}
                                                            </div>
                                                            {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center gray'></i></Link>) }
                                                       </div>
                                                    </div>
                                            </div>
                                            
                                             ))   : (<p className="mx-auto red"> {msg} </p>) 
                                            }
                                        </div>
                                      {result && result.length>0 
                                      ?  div && currentPage<div 
                                            ? <button ref={refLoadMoreBtn} onClick={loadMore } className="btn btn-info w-25 px-4 mt-3 mx-auto" id="loadMore">  {loadingMore
                                                  ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>)
                                                  : (<span className='mx-auto'> تحميل المزيد</span>)} </button>
                                            : <p className="mx-auto w-fit red">نهاية النتائج</p> 
                                      : <span></span>}
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
