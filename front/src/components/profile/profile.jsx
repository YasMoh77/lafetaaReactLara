import {useEffect,useState,useRef} from 'react'
import {Link, Routes,Route} from 'react-router-dom'
import { useNavigate } from 'react-router'
//import ProfileData from './profileData'
//import ProfileSigns from './profileSigns'
//import ProfileFavourite from './ProfileFavourite'
import ShowSaved from '../show/ShowSaved'
import Dashboard from '../admin/dashboard'
import CPanel from '../admin/routes/Ads'
import {http} from '../axios/axiosGlobal'
import GetCatSubcat from '../helpers/catSubcat'
import GetCountryStateCity from '../helpers/countryStateCity'
import { Modal, Button } from "react-bootstrap";
import GetUserName from '../helpers/getUserName'
import GetStars from '../helpers/GetStars'
import './profile.css'



const Profile = () => {
        
 //get login data
 const loginData=JSON.parse(localStorage.getItem('loginData'));
 const email=loginData && loginData.email;
 //get user ads
 const [userAds, setUserAds] = useState([])
 const refBtnMoreAds = useRef('')
 //search for waiting and featured ads
 const [searchSelect, setSearchSelect] = useState(null)
 const [chooseSearch, setChooseSearch] = useState('')
 const [startSelect, setStartSelect] = useState(false)
 const chooseSearchSelect = useRef('')
 //get & search for favourite ads
 const [favourites, setFavourites] = useState([])
 const [searchFavourites, setSearchFavourites] = useState([])
 const [savedStatuses, setSavedStatuses] = useState({})
 const [startFav, setStartFav] = useState(false)
 const refBtnMoreFavourites = useRef('')
 const refBtnLoadMoreSearchInput = useRef('')


 
//search
const navigate=useNavigate();
//const refsearchAdsInput=useRef()
const [searchAdsInput, setSearchAdsInput] = useState([])
const [msg, setMsg] = useState('')
const [loading, setLoading] = useState(false)
const [profileData, setProfileData] = useState(false)
const [adsNum, setAdsNum] = useState(null)
const [pageTotal, setPageTotal] = useState(0)
const [startSearchFav, setStartSearchFav] = useState(false)
const [startSearchFavInput, setStartSearchFavInput] = useState(false)
const [searchValue, setSearchValue] = useState('')
const [loader, setLoader] = useState(false)
// loadMore
const [currentPage, setCurrentPage] = useState(1)
const [loadingMore, setLoadingMore] = useState(false)
const [searchWord, setSearchWord] = useState('')
//const refBtnMore = useRef('')
const refBtnMoreInput = useRef('')
const refBtnMoreSelect = useRef('')

//enlarge images
const [enlarge, setEnlarge] = useState('')
const baseURLImg='http://127.0.0.1:8000/storage/images/';
//edit form
const [imgId, setImgId] = useState('')
const [imgName, setImgName] = useState('')
const [imgSrc, setImgSrc] = useState('')
const [optPhone, setOptPhone] = useState('')
//optional
const [optWhats, setOptWhats] = useState('')
const [optEmail, setOptEmail] = useState('')
const [optWeb, setOptWeb] = useState('')
const [optYoutube, setOptYoutube] = useState('')
const [countryId, setCountryId] = useState('')
//more form fields
const refTitle = useRef('')
const refSmall = useRef('')
const refFile = useRef('')
const refPhone = useRef('')
const refId = useRef('')
const refEditFeature = useRef(0)
const [loadForm, setLoadForm] = useState(false)
const [responseError, setResponseError] = useState('')
const [responseOk, setResponseOk] = useState('')
const [editFeature, setEditFeature] = useState('')
//additional values
const refWhats = useRef('')
const refEmail = useRef('')
const refWeb = useRef('')
const refYoutube = useRef('')

//for making ads pro (tameez)
const [imgRocketId, setImgRocketId] = useState('')
const refPackage = useRef('')
const refRocketId = useRef('')
const refRocketPhone = useRef('')
const refPay = useRef('')
const rocketBtn = useRef('')
const [responseRocket, setResponseRocket] = useState('')
const [tameezFeature, setTameezFeature] = useState('')

//go to login if not logged in
useEffect(() => {
    if(!loginData){
        navigate('/login');
    }
}, [navigate])



//get results when searching my ads both in upper input or in favourites
const searchAdsInputFunc=async(word,email)=>{
   // only if input isnt empty
   if(word.length>0){
        setLoading(true)
        //fetch api
        const res= await http.post('/searchWordAds',{word,email})
       // set states
        setAdsNum(res.data.adsNum)
        setPageTotal(res.data.div)
        setSearchWord(res.data.word)
        setSearchAdsInput(res.data.userAds)
        //empty other search results
        setFavourites([])
        setSearchFavourites([])
        setProfileData(false)
        res.data.msg&&setMsg(res.data.msg)
        setLoading(false)
   }else{
       setSearchAdsInput([]) 
       setFavourites([])
   }
}

 
//load more ads when search using input
const loadMoresearchAdsInput=async()=>{ 
    //disable loadMore button
    refBtnMoreInput.current.disabled=true;
    //start loading
    setLoadingMore(true);
    const Page = currentPage + 1;
    //fetch data
    const word=searchWord;
    const res= await http.post(`/searchWordAds`,{Page,word,email});
    const newItems = res.data.userAds;
    // Append new items to existing results
    setSearchAdsInput(prevData => [...prevData, ...newItems]);
    //increment currentPage
    setCurrentPage(Page); // Update current page
    setPageTotal(res.data.div)
    setLoadingMore(false);  
    //enable loadMore button
    refBtnMoreInput.current.disabled=false;      
}


//get results when searching input in favourites
const searchFavouriteInputFunc=async(e,word,email)=>{
    e.preventDefault()
    // works only if there's search word
    if(word.length>0){
        //hide the sign for showing favourites
        setStartFav(false)
        //show sign for the start of search results
        setStartSearchFav(true) 
        //start spinner
        setLoader(true)
         //fetch api
         const res= await http.post('/searchWordFavourites',{word,email});
         // Check saved status 
        const bringFavouriteItems=res.data.favourites;
        if (loginData) {
            const itemIds = bringFavouriteItems.map(e => e.item_id);
            const statuses = await checkSavedStatus(itemIds, loginData.email);
            setSavedStatuses(statuses);  
        }
        // set states
         setAdsNum(res.data.adsNum)
         setPageTotal(res.data.div)
         setSearchWord(res.data.word)
         //empty other search results
         setSearchAdsInput([]) 
         setUserAds([])
         //store search values
         setSearchFavourites(res.data.favourites)
         // set current page to 1 to cancel preveious search results and start from first page
         setCurrentPage(1)
         setProfileData(false)
         res.data.msg&&setMsg(res.data.msg)
         setLoader(false)
    }
 }


 //get results when searching input in favourites
const loadMoreSearchFavouriteInputFunc=async(e)=>{
    //disable btn to prevent double form submission
    refBtnLoadMoreSearchInput.current.disabled=true
    e.preventDefault()
      // start spinner
        setLoadingMore(true)
        const word=searchWord
        const Page = currentPage + 1;
         //fetch api
         const res= await http.post('/searchWordFavourites',{Page,word,email});
         // Check saved status 
        const newItems=res.data.favourites;
        if (loginData) {
            const itemIds = newItems.map(e => e.item_id);
            const statuses = await checkSavedStatus(itemIds, loginData.email);
            setSavedStatuses(statuses);  
        }
        // set states
         setAdsNum(res.data.adsNum)
         setPageTotal(res.data.div)
         setFavourites([])
         setSearchFavourites(prevData => [...prevData  , ...newItems])
         setCurrentPage(Page)
         setProfileData(false)
         res.data.msg&&setMsg(res.data.msg)
         setLoadingMore(false)
         refBtnLoadMoreSearchInput.current.disabled=false
 }


  //Search when choose from select (search select) 
  const chooseSearchFunc=async(searchVal)=>{
   // store search word in a state to use it later when loading more
    setChooseSearch(searchVal)
    if(searchVal!==''){
        setStartSelect(true)
       //start loading spinner before fetching data
       setLoader(true)
       //empty user ads which were shown before
       setUserAds([])
       //fetch data
       const res= await http.post(`/ads/user-search`,{email,searchVal});        
        //empty other search results
        setSearchAdsInput([]) 
        setSearchFavourites([])
       //store search data 
       setSearchSelect(res.data.ads)
       //store ads number and number of shown ads & msg
       setAdsNum(res.data.adsNum)
       res.data.msg&&setMsg(res.data.msg)
       setPageTotal(res.data.div)
       //end loading spinner after fetching data
       setLoader(false)
    }
  }

  
  //Search when choose from select (search select) 
  const loadMoreChooseSearchFunc=async()=>{
    //check refBtnMoreSelect doesn't return null value
    if(refBtnMoreSelect.current){ refBtnMoreSelect.current.disabled=true;}
       //start loading spinner before fetching data
       setLoadingMore(true)
       const searchVal=chooseSearch
       const Page=currentPage + 1
       //fetch data
       const res= await http.post(`/ads/user-search`,{Page,email,searchVal});
        //don't show old ads
        setUserAds([])
       //add new items to old ones and store  
       const newItems=res.data.ads
       setSearchSelect(prevData => [...prevData , ...newItems])
       //store ads number and number of ads shown on page
       setAdsNum(res.data.adsNum)
       setPageTotal(res.data.div)
       setCurrentPage(Page)
       //end loading spinner after fetching data
       setLoadingMore(false)
       if(refBtnMoreSelect.current){ refBtnMoreSelect.current.disabled=false;}
  }


//get ads in profile added by this user 
const ads=async()=>{
    //start loading spinner before fetching data
    setLoading(true)
    //fetch data
    const email=loginData.email;
    const postData={email,currentPage};
    const res= await http.post(`/ads/user`,postData);
    setUserAds(res.data.ads)
    //empty other search results
    setSearchAdsInput([]) 
    setSearchFavourites([])
    setFavourites([])
    setAdsNum(res.data.adsNum)
    setPageTotal(res.data.div)
    //end loading spinner after fetching data
    setLoading(false)
}

//get ads in profile addes by this user 
const loadMoreAds=async()=>{
    //disable loadMore button
     refBtnMoreAds.current.disabled=true;
    //start loading
    setLoadingMore(true);
    const Page = currentPage + 1;
     //store values
     const email=loginData.email;
     //fetch data
     const res= await http.post(`/ads/user`,{email,Page});
     const newItems = res.data.ads;
     // Append new items to existing results
     setUserAds(prevData => [...prevData, ...newItems]);
     //increment currentPage
     setCurrentPage(Page); 
     setLoadingMore(false);  
     //enable loadMore button
     refBtnMoreAds.current.disabled=false; 
}

    /******************************** favourites ******************************/
    //check if ad is saved or not
   const checkSavedStatus = async (itemIds, userEmail) => {
        try {
        const res = await http.post('/checkSaved', { itemIds, userEmail });
        // console.log(res.data.message)
        return res.data.message; // Assuming it returns an object like { itemId1: 'saved', itemId2: 'not_saved', ... }
        
        } catch (error) {
        // console.error('Failed to check saved status', error);
        return {};
        }
    };


    //get favourite ads
    const getFavourites=async()=>{
        //start loading spinner before fetching data
        setLoading(true)
        setStartFav(true)
        //get favourites
        const res= await http.post(`/favourites`,{email});
        // Check saved status 
        const bringFavouriteItems=res.data.data;
        if (loginData) {
            const itemIds = bringFavouriteItems.map(e => e.item_id);
            const statuses = await checkSavedStatus(itemIds, loginData.email);
            setSavedStatuses(statuses);  
        }
        //store values
        setFavourites(res.data.data)
        //console.log(res.data)
        setSearchFavourites([])
        setSearchAdsInput([]) 
        setUserAds([])
        setStartSelect(false)
        setAdsNum(res.data.adsNum)
        setPageTotal(res.data.div)
        res.data.msg&&setMsg(res.data.msg)
        //end loading spinner after fetching data
        setLoading(false)
    }


     //load more favourited ads
   const loadMoreFavourites=async()=>{
    //disable loadMore button
    refBtnMoreFavourites.current.disabled=true;
    //start loading
    setLoadingMore(true);
    const Page = currentPage + 1;
     //fetch data
     const res= await http.post(`/favourites`,{email,Page});
     // Check saved status 
     const newItems = res.data.data;
     if (loginData) {
         const itemIds = newItems.map(e => e.item_id);
         const statuses = await checkSavedStatus(itemIds, email);
         setSavedStatuses(statuses);  
     }
     //empty other search results
     setSearchFavourites([])
     // Append new items to existing results
     setFavourites(prevData => [...prevData, ...newItems]);
     //increment currentPage
     setCurrentPage(Page); 
     setPageTotal(res.data.div)
     setAdsNum(res.data.adsNum)
     setLoadingMore(false);  
     //enable loadMore button
     refBtnMoreFavourites.current.disabled=false;      
  }

 /******************************** End favourites ******************************/
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

 //edit ads
const editAd=async(id,NAME,src)=>{ //
  //store received values
    setImgId(id)
   setImgName(NAME)
   setImgSrc(src)
   //api  call
   const res=await http.post('/fields',{id});
   //store in states
   setOptPhone(res.data.phone ? res.data.phone : '')
   setOptWhats(res.data.whats ? res.data.whats : '')
   setOptWeb(res.data.web ? res.data.web : '')
   setOptEmail(res.data.email ? res.data.email : '')
   setOptYoutube(res.data.youtube ? res.data.youtube : '')
   setCountryId(res.data.country==1?'20':res.data.country==2?'9660':res.data.country==3?'9650':res.data.country==4?'9710':res.data.country==5?'9740':'9680')
   document.querySelector('body').style.overflow='hidden';
  }

   const stopEditAd=()=>{
    setImgId('')
    document.querySelector('body').style.overflow='initial';
   }

   //start tameezAd (for making ads pro)
const tameezAd=(id,NAME,src,feature)=>{
    setTameezFeature(feature)
    setImgRocketId(id)
    setImgName(NAME)
    setImgSrc(src)
    document.querySelector('body').style.overflow='hidden';
 }

 //hide ad after making pro (tameez)
 const stopTameezAd=()=>{
  setImgRocketId('')
  setResponseRocket('')
   document.querySelector('body').style.overflow='initial';
}


//show form error
const showError=(field,value,ref)=>{
    if(field==value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
  }

  //show error if title <5 or >40
  const showErrorTitle=(field,ref)=>{
      if(ref==refTitle && (field && field.length<5 || field && field.length>40 ) ){ref.current.style.backgroundColor='#e87878'; refSmall.current.style='color:#e87878;font-weight:bold'}else{ref.current.style.backgroundColor='white'; refSmall.current.style='color:initial;font-weight:initial'}
  }

  //show form error
  const showErrorSelect=(field,value,ref)=>{
    if(field==value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
  }

  //form for choosing package
  const submitFormPackageFunc=async(e)=>{
         e.preventDefault()
         rocketBtn.current.disabled=true;
         setLoadForm(true)
         //values
        const plan=parseInt(refPackage.current.value,10);//gold or silver
        const pay = parseInt(refPay.current.value, 10);//vodafone, bank ...etc
        const id = parseInt(refRocketId.current.value, 10);//item_id
        const phone = refRocketPhone.current.value.trim();//user phone
        //check if empty
        showErrorSelect(plan,'0',refPackage);
        showErrorSelect(pay,'0',refPay);
        showError(phone,'',refRocketPhone);
        //if not empty go ahead
        if(plan!='' && pay!='' && id!='' && phone!=''  ){
            //send data
            const res=await http.post('/package',{plan,pay,id,phone});
            if(res.data.message ){
                  //const resMsg=res.data.message;
                  setResponseRocket('<p class=" red">' +res.data.message+'</p>')
                  setLoadForm(false)
                //  rocketBtn.current.disabled==true ? rocketBtn.current.disabled=false: rocketBtn.current.disabled=true ;
            }else if(res.data.success){
                  setResponseRocket('<i class="bi bi-check-circle-fill fs-2 green"></i>')
                  localStorage.setItem('tameez',JSON.stringify(res.data))
                    if(res.data.tameezPay=='vodafone' || res.data.tameezPay=='bank'){
                        setLoadForm(false)
                        navigate('/success-pay')
                        window.location.reload()
                    }
              }else if(res.data.redirectPaypal){
                 //redirect to paypal without axios to avoid cors.php restrictions
                 const price=res.data.price;
                 window.location.href=`http://127.0.0.1:8000/api/paypalPayment/${plan}/${price}/${id}/${phone}`;

              }else if(res.data.redirectVisa){
                setResponseRocket('<p>visa</p>')
                setLoadForm(false)
              }
              
      }else{
        setLoadForm(false)
        rocketBtn.current.disabled=false;
      }         
  }
  //End tameezAd (for making ads pro)

  
  //regex expresiion
  const reg=/^[0-9]+$/;
  const showErrorPhone=(phone)=>{
     if(phone && phone!='' && !reg.test(phone) ){
        refPhone.current.style.backgroundColor='#e87878';
        return 1; //wrong phone number
     }else{
        refPhone.current.style.backgroundColor='white';
        return null; //correct phone number
     }
 }

  
//submit form for updating
const submitFormUpdateFunc = async (e) => {
      e.preventDefault();
      //stop showing error message
      setResponseError('')
      setResponseOk('')
      //values
      const title = refTitle.current.value.trim();
      const id = parseInt(refId.current.value, 10);
      const file = refFile.current.files[0];
      const phoneInput=refPhone.current.value;
      //additional values
     // const phoneUpdate= phoneInput=='' ? 0 : isNaN(parseInt(refPhone.current.value,10))?0:parseInt(refPhone.current.value,10);
      const whatsInput=refWhats.current.value;
      const whats=whatsInput=='' ? 0 : isNaN(parseInt(refWhats.current.value,10))?0:parseInt(refWhats.current.value,10);
      const web=refWeb.current.value;
      const emailSocial=refEmail.current.value;
      const youtube=refYoutube.current.value;
        //check if form values are valid
       // showError(title,'',refTitle);
        showErrorTitle(title,refTitle);
        showErrorPhone(phoneInput);        
        // Create a FormData object
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('email', email);
        formData.append('phone', phoneInput);
        formData.append('whats', whats);
        formData.append('web', web);
        formData.append('emailSocial', emailSocial);
        formData.append('youtube', youtube);
        formData.append('id',id)
        
        //check if not all fields are empty
        if( title!='' && title.length>=5 && title.length<=40  ||  file!=null || phoneInput && showErrorPhone(phoneInput)==null || whats!=0 || web!='' || emailSocial!='' || youtube!=''){
        try {
          setLoadForm(true);
          const res = await http.post(`/ads/update/${id}`, formData);
          // Return to normal
          setLoadForm(false);
          setResponseOk(res.data.message)
          //close overlay and reload
          setTimeout(() => {
            stopEditAd();
            window.location.reload();
          }, 2000);
        } catch (error) {
          setLoadForm(false);
          error.response ? setResponseError(error.response.data.errors) :setResponseError('');
        }
     }else{
      setResponseOk(<span className='red'>لا توجد تعديلات</span>)
     }
};

//get country code for whatsapp
const code=(name)=>{
    if(name==1||name==='مصر'){return '20';} else  if(name==2||name==='السعودية'){return '9660';}
    else  if(name==3||name==='الكويت'){return '9650';} else  if(name==4||name==='الامارات'){return '9710';}
    else  if(name==5||name==='قطر'){return '9740';} else  if(name==6||name==='سلطنة عمان'){return '9680';}
  }


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

//confirm if need to delete an ad
const confirmDelete=()=>{
    return window.confirm('هل ترغب في الحذف ؟ ');
}

const deleteFunc=async(id)=>{
     if(confirmDelete){
         //send api
         const res=await http.post(`/ads/delete/${id}`)
         alert(res.data.message)
     }
}


//show user's data on page load
useEffect(() => {
    setProfileData(true)
}, [])
//////////////////////////////

    return (
        <div className='container-fluid profile-cont'>
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

           <div className='mb-5'>
               <i className='bi bi-house-fill'></i> <span>حسابي</span>
           </div>
            {
                (loginData &&
                    //user is logged in
                     (<div>
                           <div className='d-flex bg-primary py-3 px-2 align-items-center prof-head overflow-auto'>
                                <a  onClick={()=>{ setProfileData(true);setSearchAdsInput([]);setMsg('')} } className='ms-5 mb-0 hand' >بياناتي</a>
                                <a  onClick={()=>{ ads();setSearchAdsInput([]);setSearchSelect([]);setProfileData(false);setMsg('')} } className='ms-5 mb-0 hand'>لافتاتي</a>
                                <a  onClick={()=>{ getFavourites();setSearchAdsInput([]);setSearchSelect([]);setProfileData(false);setMsg('');setUserAds([])} } className='ms-5 mb-0 hand'>المفضلة</a>
                                {loginData && loginData.admin !=null && <Link to='/dashboard' className='ms-5 mb-0'> لوحة التحكم</Link>}
                                <a onClick={confirmLogOut}  className='ms-5 mb-0 hand' onClick={DologOut} >تسجيل الخروج</a>
                                {loginData  && <input type='text' className='rounded-2 border-0 w-5 input-search-profile px-2' onKeyUp={(e)=>{searchAdsInputFunc(e.target.value,email)}} placeholder='بحث في لافتاتي' />}
                           </div>

                            
                            <div>
                                <p className='mt-3 mb-5 font-weight-bold'>أهلا {loginData.name}</p>

                             {/************** edit images *************/}
                            {imgId && 
                            (<div className="overlay edit-overlay">
                                <form  onSubmit={submitFormUpdateFunc} className='edit-form py-3 mt-5 mb-3 px-2 rounded-4' >
                                    <img className='mx-auto d-block' src={imgSrc} />

                                    <div className='head-edit w-fit mt-4 mx-auto py-2 px-4 w-50 rounded-2 white'>
                                        <p className='m-0 w-fit mx-auto fs-5 fw-bold'>تحرير لافتة</p>
                                    </div>

                                    <label  className='d-block mb-2 mt-4' >تعديل العنوان</label>
                                    <input id='title' className='d-block mb-2 w-100' ref={refTitle} type='text' placeholder={imgName}   />
                                    <small ref={refSmall} className='d-block w-fit mx-auto mb-3' >5 - 40 حرف</small>
                                    
                                    <label htmlFor="phone" className="d-block mb-2">تعديل التليفون  </label>
                                    <input type="text" id='phone' ref={refPhone}  className="d-block mb-4 w-100" placeholder={'0'+optPhone} />
                    
                                    <label  className='d-block mb-2' >تغيير الصورة</label>
                                    <input type='file' className='d-block mb-5' ref={refFile} />

                                    {/* optional fields about contacting */}
                                    <div className='py-4 my-5 ps-2 '>
                                        <p className='fs-4 fw-bold'>حقول اختيارية</p>

                                        <div className="input-cont-pro d-flex ">
                                            <label htmlFor="whats" className="form-label"> واتس اب </label>
                                            <input type="text" id='whats' ref={refWhats} className="form-control bg-light" placeholder={countryId+optWhats} />
                                        </div>
                                        <small className='w-fit mx-auto mt-0 mb-4 d-block'>اكتب رقم واتساب مع رمز الدولة</small>


                                        <div className="input-cont-pro d-flex ">
                                            <label htmlFor="web" className="form-label">موقع الكتروني </label>
                                            <input type="text" id='web' ref={refWeb} className="form-control bg-light" placeholder={optWeb} />
                                        </div>
                                        <small className='w-fit mx-auto mt-0 mb-4 d-block'> يبدأ بـ https://www  &emsp; أو &emsp; http://www</small>


                                        <div className="input-cont-pro d-flex ">
                                            <label htmlFor="email" className="form-label">بريد الكتروني </label>
                                            <input type="text" id='email' ref={refEmail} className="form-control bg-light" placeholder={optEmail} />
                                        </div>
                                        <small className='w-fit mx-auto mt-0 mb-4 d-block'> مثال: example@gmail.com</small>


                                        <div className="input-cont-pro d-flex ">
                                            <label htmlFor="youtube" className="form-label">قناة يوتيوب  </label>
                                            <input type="text" id='youtube' ref={refYoutube} className="form-control bg-light" placeholder={optYoutube} />
                                        </div>
                                        <small className='w-fit mx-auto mt-0 mb-4 d-block'> يبدأ بـ https://www  &emsp; أو &emsp; http://www</small>
                                    </div>

                                    <input type='hidden'  ref={refId} value={imgId} />
                                    <input type='hidden'  ref={refEditFeature} value={editFeature} />
                                    

                                    {loadForm ? <button  className='btn btn-info w-25 mx-auto d-block'><span className='spinner-border gray d-block m-auto'></span></button> : <button className='btn btn-info w-25 mx-auto mb-5 d-block'>أرسل</button> }
                                    
                                    {/* show form error */}
                                    {responseOk &&  <p className='mx-auto mt-3 mb-5 w-fit green' > {responseOk}</p> }
                                    
                                    {/* show form error */}
                                    {responseError && Object.keys(responseError).map((key)=>(
                                        <div className='mt-3 '>
                                            {responseError[key].map((e)=>(
                                                <p className='mb-0 mx-auto w-fit red'>{e}- {key}</p>
                                            ))}
                                        </div>
                                    ))  }
                                    {/* end show form error */}
                                </form><i onClick={stopEditAd} className="close-btn bi bi-x-square-fill" ></i>
                            </div>)}



                            {/* making ads pro (tameez) */}
                            {imgRocketId && 
                            (<div className="overlay edit-overlay">
                                <form  onSubmit={submitFormPackageFunc} className='edit-form py-3 mt-5 mb-3 px-4 rounded-4' >
                                    <img className='mx-auto d-block' src={imgSrc} />

                                    <div className='head-pro w-fit my-4 mx-auto py-2 px-4 w-50 rounded-2 white'><p className='m-0 w-fit mx-auto fs-5 fw-bold'>تمييز لافتة</p></div>
                                    <div>
                                        <p className='m-0 fw-bold'>باقة ذهبية </p>
                                            <ul>
                                            <li>الظهور بحجم كبير في أول الصفحة الرئيسية</li>
                                            <li>أولوية الظهور في نتائج البحث قبل اللافتات الفضية والعادية</li>
                                            <li>التمييز لمدة 3 شهور</li>
                                            <li>السعر 300 ج.م.</li>
                                            </ul>
                                        <p className='m-0 fw-bold'>باقة فضية </p>
                                            <ul>
                                            <li> أولوية الظهور في نتائج البحث قبل اللافتات العادية</li>
                                            <li>التمييز لمدة 3 شهور</li>
                                            <li>السعر 150 ج.م.</li>
                                            </ul>
                                    </div>
                                    <label  className='d-block mb-2 mt-4 fw-bold'> اختر باقة تمييز</label>
                                    <select id='pack' className='d-block mb-4 w-25' ref={refPackage}>
                                    <option value='0'>اختر </option>
                                    <option value='1'>ذهبية</option>
                                    {tameezFeature && tameezFeature<1 ? <option value='2'>فضية</option> : <option disabled value='2'>فضية</option> }
                                    </select>

                                    <label  className='d-block mb-2 mt-4 fw-bold'> اختر طريقة الدفع </label>
                                    <select id='pay' className='d-block mb-4 w-25' ref={refPay}>
                                    <option value='0'>اختر </option>
                                    <option value='1'>فودافون كاش</option>
                                    <option value='2'>حوالة بنكية</option>
                                    <option value='3'> باي بال</option>
                                    <option value='4'> فيزا / ماستر كارد</option>
                                    </select>

                                    <label  className='d-block mb-2 mt-4 fw-bold'>   أدخل رقم تليفونك </label>
                                    <input type='text' ref={refRocketPhone} className='w-25 d-block mb-4' />
                                    
                                    <input type='hidden'  ref={refRocketId} value={imgRocketId} />
                                    {loadForm ? <button  className='btn btn-info w-25 mx-auto d-block'><span className='spinner-border gray d-block m-auto'></span></button> : <button ref={rocketBtn} className='btn btn-info w-25 mx-auto d-block'>أرسل</button> }
                                    
                                    {/* show form error */}
                                    <p className='mb-0 mx-auto mt-3 w-fit' dangerouslySetInnerHTML={{ __html : responseRocket }} />
                                    {/* show form error */}
                                    {responseError && Object.keys(responseError).map((key)=>(
                                        <div className='mt-3 '>
                                            {responseError[key].map((e)=>(
                                                <p className='mb-0 mx-auto w-fit red'>{e}</p>
                                            ))}
                                        </div>
                                    ))  }
                                    {/* end show form error */}
                                </form><i onClick={stopTameezAd} className="close-btn bi bi-x-square" ></i>
                            </div>)}


                            {/* enlarge images */}
                            {enlarge && 
                            (<div className="overlay">
                                <img src={enlarge}  alt="k" /> <i onClick={stopEnlargeFun} className="close-btn bi bi-x-square" ></i>
                            </div>)}
                            
                            <div className=''> 
                                {
                                    loading 
                                    ? <div className='w-fit mx-auto'><p className='spinner-border gray large-spinner'></p></div>
                                    /* if there's search through input */
                                    :  searchAdsInput && searchAdsInput.length>0 
                                        ?
                                            <> 
                                             <>
                                             <p className='green'>نتائج البحث</p>
                                             {/* search form select */}
                                             <div className='d-flex justify-content-between mb-2 w-100'>
                                                <p>{adsNum}</p>
                                                <form onChange={(e)=>{chooseSearchFunc(e.target.value)}} className='w-25'>
                                                    <select ref={chooseSearchSelect} className='w-100'>
                                                        <option value=''>اختر</option>
                                                        <option value='waiting'>اعلانات في انتظار الموافقة</option>
                                                        <option value='featured'>اعلانات مميزة</option>
                                                    </select>
                                                </form>
                                             </div>
                                             </>
                                             <div className="d-flex flex-wrap show-wrapper justify-content-between ">
                                             {searchAdsInput.map((e, index)=>(
                                                <div key={e.item_id} className='col-xs-12 col-md-6 col-lg-4 main3 search'>
                                                    <img onClick={(e)=>{enlargeFun(e.target.src)}} key={index} src={baseURLImg+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                                    <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                    <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                    <div className='pe-1 my-1'>{e.NAME}</div>                                            
                                                    <div className='featured-icons-div d-flex px-1 justify-content-between fs-5 fs-md-6'>
                                                        <div>
                                                            {e.phone >0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                            {e.whatsapp >0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                            {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                            {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                            {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                                        </div>
                                                        {e.approve ==1 ? <i title='معروض' className='bi bi-unlock-fill green'></i> : <i title='في انتظار الموافقة' className='bi bi-lock-fill yellow'></i>} 
                                                
                                                    </div>
                                                    <div key={e.item_id}  className='d-flex justify-content-around mt-2'>
                                                        {/* edit ad*/}
                                                        {/* promote and display according to plan*/}
                                                        <i title='تحرير' onClick={()=>{editAd(e.item_id,e.NAME,baseURLImg+e.photo)}} className='bi bi-wrench'></i>     
                                                        {e.feature==2 && <i title='باقة ذهبية'    className="bi bi-rocket-takeoff-fill green"></i>}
                                                        {e.feature==1 && <i title='باقة فضية'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff-fill yellow"></i>}
                                                        {e.feature==0 && <i title='تمييز'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff"></i>}
                                                        {/* delete ad*/}
                                                        <i title='حذف' onClick={()=>{confirmDelete();deleteFunc(e.item_id)}} className='bi bi-trash'></i>
                                                    </div>
                                                </div>
                                                ))}
                                                </div>
                                            </> 

                                            /* if clicked on user data, show user's data(name & email) */ 
                                        : /*msg
                                          ?<p>{msg}</p>
                                          :*/ profileData
                                            ? 
                                                <div className='profData-div py-3 px-2'>
                                                    <p> الاسم : {loginData.name}</p>
                                                    <p> البريد الالكتروني : {loginData.email}</p>
                                                </div>
                                            :  /* show user's ads and serach select */
                                                <>
                                                    {/* show user's ads when clicking on myAds */}
                                                        {userAds && userAds.length>0 
                                                            ? <div> 
                                                                    {/* search form select */}
                                                                    <div className='d-flex justify-content-between mb-2 w-100'>
                                                                        <p>{adsNum}</p>
                                                                        <form onChange={(e)=>{chooseSearchFunc(e.target.value)}} className='w-25'>
                                                                        <select ref={chooseSearchSelect} className='w-100'>
                                                                            <option value=''>اختر</option>
                                                                            <option value='waiting'>اعلانات في انتظار الموافقة</option>
                                                                            <option value='featured'>اعلانات مميزة</option>
                                                                        </select>
                                                                        </form>
                                                                    </div>
                                                                    <div id="show2"  className="d-flex flex-wrap show-wrapper justify-content-between ">
                                                                        {/* show user's ads */}
                                                                        {userAds.map((e, index)=>(
                                                                            <div key={e.item_id} className='col-xs-12 col-md-6 col-lg-4 main3 main-prof'>
                                                                                <img onClick={(e)=>{enlargeFun(e.target.src)}} key={index} src={baseURLImg+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                                                                <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                                                <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                                                <div className='pe-1 my-1'>{e.NAME}</div>                                            
                                                                                <div className='featured-icons-div d-flex px-1 justify-content-between fs-5 fs-md-6'>
                                                                                    <div>
                                                                                        {e.phone >0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                                                        {e.whatsapp >0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                                                        {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                                                        {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email} ><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                                                        {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                                                                    </div>
                                                                                    {e.approve ==1 ? <i title='معروض' className='bi bi-unlock-fill green'></i> : <i title='في انتظار الموافقة' className='bi bi-lock-fill yellow'></i>} 
                                                                                </div>
                                                                                            
                                                                                <div key={e.item_id} title={e.phone} className='d-flex justify-content-around mt-2'>
                                                                                    {/* edit ad*/}
                                                                                    <i title='تحرير' onClick={()=>{editAd(e.item_id,e.NAME,baseURLImg+e.photo)}} className='bi bi-wrench'></i>
                                                                                    {/* promote and display according to plan*/}
                                                                                    {e.feature==2 && <i title='باقة ذهبية'    className="bi bi-rocket-takeoff-fill green"></i>}
                                                                                    {e.feature==1 && <i title='باقة فضية'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff-fill yellow"></i>}
                                                                                    {e.feature==0 && <i title='تمييز'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff"></i>}
                                                                                    {/* delete ad*/}
                                                                                    <i title='حذف' onClick={()=>{confirmDelete();deleteFunc(e.item_id)}} className='bi bi-trash'></i>
                                                                                </div>
                                                                            </div>
                                                                        ))} 
                                                                    </div>
                                                                    {userAds && userAds.length>0 && !loading && pageTotal && currentPage<pageTotal && (<button ref={refBtnMoreAds} onClick={loadMoreAds} className="btn btn-info w-25 mx-auto d-block  loadMoreBtn" id="loadMore">   {loadingMore ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) : (<span className='white'>تحميل المزيد </span>)} </button>) }
                                                                    {userAds && userAds.length>0 && !loading && pageTotal && currentPage>pageTotal && (<p className="mx-auto w-fit red">نهاية النتائج</p>) }
                                                                </div>

                                                                /* show search results after selecting from the search select */
                                                            :  
                                                                <> 
                                                                    {startSelect ?
                                                                        <>
                                                                            <p className='green'>نتائج البحث</p>
                                                                            {/* search form select */}
                                                                            <div className='d-flex justify-content-between mb-2 w-100'>
                                                                                <p>{adsNum}</p>
                                                                                <form onChange={(e)=>{chooseSearchFunc(e.target.value)}} className='w-25'>
                                                                                    <select ref={chooseSearchSelect} className='w-100'>
                                                                                        <option value=''>اختر</option>
                                                                                        <option value='waiting'>اعلانات في انتظار الموافقة</option>
                                                                                        <option value='featured'>اعلانات مميزة</option>
                                                                                    </select>
                                                                                </form>
                                                                            </div>
                                                                        
                                                                            {loader 
                                                                                ? <div className='w-fit mx-auto mt-5'><p className='spinner-border large-spinner'></p></div>
                                                                                :
                                                                                <> 
                                                                                    {searchSelect&&searchSelect.length>0
                                                                                        ?   <div>
                                                                                                    <div id="show2"  className="d-flex flex-wrap show-wrapper justify-content-between ">
                                                                                                    
                                                                                                        {searchSelect.map((e, index)=>(
                                                                                                        <div key={e.item_id} className='col-xs-12 col-md-6 col-lg-4 main3 main-prof'>
                                                                                                            <img onClick={(e)=>{enlargeFun(e.target.src)}} key={index} src={baseURLImg+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                                                                                                <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                                                                                <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                                                                            <div className='pe-1 my-1'>{e.NAME}</div>                                            
                                                                                                            <div className='featured-icons-div d-flex px-1 justify-content-between fs-5 fs-md-6'>
                                                                                                                <div>
                                                                                                                    {e.phone >0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                                                                                    {e.whatsapp >0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                                                                                    {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                                                                                    {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email} ><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                                                                                    {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                                                                                                </div>
                                                                                                                {e.approve ==1 ? <i title='معروض' className='bi bi-unlock-fill green'></i> : <i title='في انتظار الموافقة' className='bi bi-lock-fill yellow'></i>} 
                                                                                                            </div>
                                                                                                                        
                                                                                                            <div key={e.item_id} title={e.phone} className='d-flex justify-content-around mt-2'>
                                                                                                                    {/* edit ad*/}
                                                                                                                    <i title='تحرير' onClick={()=>{editAd(e.item_id,e.NAME,baseURLImg+e.photo)}} className='bi bi-wrench'></i>
                                                                                                                    {/* promote and display according to plan*/}
                                                                                                                    {e.feature==2 && <i title='باقة ذهبية'    className="bi bi-rocket-takeoff-fill green"></i>}
                                                                                                                    {e.feature==1 && <i title='باقة فضية'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff-fill yellow"></i>}
                                                                                                                    {e.feature==0 && <i title='تمييز'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff"></i>}
                                                                                                                    {/* delete ad*/}
                                                                                                                    <i title='حذف' onClick={()=>{confirmDelete();deleteFunc(e.item_id)}} className='bi bi-trash'></i>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                    </div>
                                                                                                    {searchSelect && searchSelect.length>0 && !loading && pageTotal && currentPage<pageTotal && (<button ref={refBtnMoreSelect} onClick={()=>{loadMoreChooseSearchFunc()}} className="btn btn-info w-25 mx-auto d-block  loadMoreBtn" id="loadMore">   {loadingMore ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) : (<span className='white'>تحميل المزيد </span>)} </button>) }
                                                                                                    {searchSelect && searchSelect.length>0 && !loading && pageTotal && currentPage>pageTotal && (<p className="mx-auto w-fit red">نهاية النتائج</p>) }
                                                                                            </div>
                                                                                        :<p className='w-fit mx-auto mt-5'>{msg}</p>
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </> 
                                                                    : <> 
                                                                        {startFav?
                                                                                   favourites && favourites.length>0 
                                                                                    ? <>
                                                                                            {/* search form select */}
                                                                                            <div className='d-flex justify-content-between mb-3 w-100'>
                                                                                                <p>{adsNum}</p>
                                                                                                <form onSubmit={(e)=>{searchFavouriteInputFunc(e,searchValue,email)}} className='w-50 border-1 d-flex justify-content-between' >
                                                                                                    <input type='text' className='border-1 w-75 px-2' onChange={(e)=>{setSearchValue(e.target.value)}} value={searchValue}  placeholder='بحث في المحفوظات' />
                                                                                                    <button className='w-25 border-0 bg-primary'><i className='bi bi-search fs-5'></i></button> 
                                                                                                </form>
                                                                                            </div>
                                                                                            <div id="show2"  className="d-flex flex-wrap show-wrapper justify-content-between ">
                                                                                                
                                                                                                {/* show favourite ads */}
                                                                                                {favourites.map((e, index)=>(
                                                                                                    <div key={e.item_id} className='col-xs-12 col-md-6 col-lg-4 main3'>
                                                                                                        <img onClick={(e)=>{enlargeFun(e.target.src)}} id={e.item_id}  key={index} name={e.feature} src={baseURLImg+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                                                                                        <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                                                                        <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                                                                        <div className='pe-1 my-1'>{e.NAME}</div>                                            
                                                                                                        <div className='featured-icons-div d-flex justify-content-between fs-6 fs-md-6 px-1'>
                                                                                                             <div>
                                                                                                                {e.phone >0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                                                                                {e.whatsapp >0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
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
                                                                                                                {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center'></i></Link>) }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                            {/* user's favourite ads */}
                                                                                            {favourites && favourites.length>0 && !loading && pageTotal && currentPage<pageTotal 
                                                                                                ?  (<button ref={refBtnMoreFavourites} onClick={loadMoreFavourites} className="btn btn-info w-25 mx-auto d-block  loadMoreBtn" id="loadMore">   {loadingMore 
                                                                                                        ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) 
                                                                                                        : (<span className='white'>تحميل المزيد </span>)} 
                                                                                                    </button>)
                                                                                                : !searchFavourites || searchFavourites&& searchFavourites.length<1 &&(<p className="mx-auto w-fit red">نهاية النتائج</p>)
                                                                                            } 
                                                                                        </>
                                                                                    :<p className='w-fit mx-auto mt-5'>{msg}</p>

                                                                                 /**show search favourites */
                                                                                :<div> {startSearchFav
                                                                                            && 
                                                                                                <>
                                                                                                    {/* search form select */}
                                                                                                    <div className='d-flex justify-content-between mb-3 w-100'>
                                                                                                        <p>{adsNum}</p>
                                                                                                        <form onSubmit={(e)=>{searchFavouriteInputFunc(e,searchValue,email)}} className='w-50 border-1 border d-flex justify-content-between' >
                                                                                                            <input type='text' className='border-1 w-75 px-2' onChange={(e)=>{setSearchValue(e.target.value)}} value={searchValue}  placeholder='بحث في المحفوظات' />
                                                                                                            <button className='w-25 border-0 bg-primary'><i className='bi bi-search fs-5'></i></button> 
                                                                                                        </form>
                                                                                                    </div>
                                                                                                    {loader
                                                                                                        ?<div className='w-fit mx-auto mt-5'><p className='spinner-border large-spinner'></p></div>
                                                                                                        :
                                                                                                            searchFavourites&&searchFavourites.length>0
                                                                                                            ?   <> 
                                                                                                                    <div id="show2"  className="d-flex flex-wrap show-wrapper justify-content-between ">
                                                                                                                        {/* show favourite ads */}
                                                                                                                        {searchFavourites.map((e, index)=>(
                                                                                                                        <div key={e.item_id} className='col-xs-12 col-md-6 col-lg-4 main3 main-prof'>
                                                                                                                            <img onClick={(e)=>{enlargeFun(e.target.src)}} id={e.item_id}  key={index} name={e.feature} src={baseURLImg+e.photo} alt={e.NAME} className='w-100 h-75 mx-auto d-block img'/> 
                                                                                                                            <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                                                                                            <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                                                                                                            <div className='pe-1 my-1'>{e.NAME}</div>                                            
                                                                                                                            <div className='featured-icons-div d-flex justify-content-between fs-5 fs-md-6 px-1'>
                                                                                                                                <div>
                                                                                                                                    {e.phone >0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                                                                                                                    {e.whatsapp >0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                                                                                                                    {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                                                                                                                    {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                                                                                                                    {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                                                                                                                </div>
                                                                                                                                {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center'></i></Link>) }
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        ))}
                                                                                                                    </div>
                                                                                                                    
                                                                                                                    {searchFavourites && searchFavourites.length>0 && /*!loading &&*/ pageTotal && currentPage<pageTotal 
                                                                                                                    ? (<button ref={refBtnLoadMoreSearchInput} onClick={loadMoreSearchFavouriteInputFunc} className="btn btn-info w-25 mx-auto d-block  loadMoreBtn" id="loadMore">   {loadingMore 
                                                                                                                        ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) 
                                                                                                                        : (<span className='white'>تحميل المزيد </span>)} </button>)
                                                                                                                    : !favourites || favourites&& favourites.length<1 && (<p className="mx-auto w-fit red">نهاية النتائج</p>)}
                                                                                                            </>
                                                                                                            :<p className='w-fit mx-auto mt-5'>{msg}</p>
                                                                                                    }
                                                                                                </>
                                                                                            
                                                                                       } 
                                                                                   </div>
                                                                    
                                                                         }                                                                     
                                                                     </>
                                                                   }
                                                                </>
                                                        }
                                                </>                                 
                                    } 
                                    
                            </div>            
                            {searchAdsInput && searchAdsInput.length>0 && !loading && pageTotal && currentPage<pageTotal && (<button ref={refBtnMoreInput} onClick={()=>{loadMoresearchAdsInput()}} className="btn btn-info w-25 mx-auto d-block  loadMoreBtn" id="loadMore">   {loadingMore ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) : (<span className='white'>تحميل المزيد </span>)} </button>) }
                            {searchAdsInput && searchAdsInput.length>0 && !loading && pageTotal && currentPage>pageTotal && (<p className="mx-auto w-fit red">نهاية النتائج</p>) }                               
                           
                            {/*  routes */}
                            { /*</div> {!searchAdsInput || searchAdsInput && searchAdsInput.length<1 && */}
                                <Routes>   
                                    {/*<Route path='profileData' element={<ProfileData/>} /> 
                                    <Route path='profileSigns' element={<ProfileSigns/>} />  
                                    <Route path='profileFavourite' element={<ProfileFavourite/>} />*/}
                                    <Route path='dashboard' element={<Dashboard/>} />

                                    <Route path='c-panel' element={<CPanel/>} />


                                </Routes>  
                                { /*  }    */}                           
                           </div>
                     </div>)
                     
                   )
                   
            }
        </div>
    )
}

export default Profile
