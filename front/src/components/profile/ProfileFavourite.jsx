import { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router'
import {Link} from 'react-router-dom'
import {http} from '../axios/axiosGlobal'
import ShowSaved from '../show/ShowSaved';

import  './profile.css'

const ProfileFavourite = () => {
     //get login data
  const loginData=JSON.parse(localStorage.getItem('loginData'));
  const email=loginData && loginData.email;
  const token=localStorage.getItem('token');

    const navigate=useNavigate();
    const [data, setData] = useState([])
    const [adsNum, setAdsNum] = useState(null)
    const [pageTotal, setPageTotal] = useState(null)
    const [loading, setLoading] = useState(false)
    const [savedStatuses, setSavedStatuses] = useState({})

    // loadMore
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)
    const refBtnMore = useRef('')

    //enlarge images
    const [enlarge, setEnlarge] = useState('')
    const baseURLImg='http://127.0.0.1:8000/storage/images/';
 
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

     //get the ads
    const getFavourites=async()=>{
        //start loading spinner before fetching data
        setLoading(true)
        //fetch data
        const email=loginData.email;
        const postData={email};
        const res= await http.post(`/favourites`,postData);

        // Check saved status 
        const bringFavouriteItems=res.data.data;
        if (loginData) {
            const itemIds = bringFavouriteItems.map(e => e.item_id);
            const statuses = await checkSavedStatus(itemIds, loginData.email);
            setSavedStatuses(statuses);  
        }

        setData(res.data.data)
        console.log(res.data)
        setAdsNum(res.data.adsNum)
        setPageTotal(res.data.div)
        //end loading spinner after fetching data
        setLoading(false)
    }
   


     //load more ads
   const loadMore=async()=>{
    //disable loadMore button
    refBtnMore.current.disabled=true;
    //start loading
    setLoadingMore(true);
    const Page = currentPage + 1;
     //store values
     const email=loginData.email;
     const postData={email,Page};
     //fetch data
     const res= await http.post(`/favourites`,postData);

     // Check saved status 
     const newItems = res.data.data;
     if (loginData) {
         const itemIds = newItems.map(e => e.item_id);
         const statuses = await checkSavedStatus(itemIds, loginData.email);
         setSavedStatuses(statuses);  
     }

     // Append new items to existing results
     setData(prevData => [...prevData, ...newItems]);
     //increment currentPage
     setCurrentPage(Page); // Update current page
     setLoadingMore(false);  
     //enable loadMore button
      refBtnMore.current.disabled=false;      
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

    
    useEffect(() => {
        getFavourites();
    }, [])

    //get country code for whatsapp
    const code=(name)=>{
        if(name==1||name==='مصر'){return '20';} else  if(name==2||name==='السعودية'){return '9660';}
        else  if(name==3||name==='الكويت'){return '9650';} else  if(name==4||name==='الامارات'){return '9710';}
        else  if(name==5||name==='قطر'){return '9740';} else  if(name==6||name==='سلطنة عمان'){return '9680';}
      }


    return (
        <div className='profData-div py-3 px-2' >             

             {/* enlarge images */}
             {enlarge && 
             (<div className="overlay">
                 <img src={enlarge}  alt="k" /> <i onClick={stopEnlargeFun} className="close-btn bi bi-x-square" ></i>
              </div>)}

             {/* show ads on the page */}
             <div className='container-fluid'>
                   <p>{adsNum}</p>
                   <div id="show2"  className="d-flex flex-wrap show-wrapper justify-content-between ">
                    {
                        loading ? (<p className='spinner-border gray mx-auto'></p>) : data && data.length>0 && data.map((e, index)=>(
                            <div key={e.item_id} className='col-xs-12 col-md-6 col-lg-4 main3 main-prof'>
                                <img onClick={(e)=>{enlargeFun(e.target.src)}} id={e.item_id}  key={index} name={e.feature} src={baseURLImg+e.photo} alt={e.NAME} className='w-100 h-75 mx-auto d-block img'/> 
                                     {/*<ShowCat catId={e.CAT_ID} />
                                      <ShowSubcat subId={e.subcat_id} />*/}
                                <div className='pe-1 my-1'>{e.NAME}</div>                                            
                                <div className='featured-icons-div d-flex justify-content-between px-1'>
                                   <div>
                                        {e.phone >0 ? <a href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a><i class="bi bi-telephone-fill empty"></i></a>} 
                                        {e.whatsapp >0 ? <a href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a><i class="bi bi-whatsapp empty"></i></a> } 
                                        {e.website !='' ? <a href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a><i class="bi bi-globe-americas empty"></i></a>} 
                                        {e.item_email !='' ? <a href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                        {e.youtube !='' ? <a href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a><i class="bi bi-youtube empty"></i></a> } 
                                    </div>
                                    {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center'></i></Link>) }
                                </div>
                               
                            </div>
                        )) 
                    }
                   </div>
                   {data && data.length>0 && !loading && pageTotal && currentPage<pageTotal && (<button ref={refBtnMore} onClick={loadMore} className="btn btn-info w-25 mx-auto d-block  loadMoreBtn" id="loadMore">   {loadingMore ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>) : (<span className='white'>تحميل المزيد </span>)} </button>) }
                   {data && data.length>0 && !loading && pageTotal && currentPage>pageTotal && (<p className="mx-auto w-fit red">نهاية النتائج</p>) }

            </div>
        </div>
    )
    
}

export default ProfileFavourite
