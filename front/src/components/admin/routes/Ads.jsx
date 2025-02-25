
import {useEffect,useState,useRef,useCallback} from 'react'
import { useNavigate } from 'react-router'
import {http,http4} from '../../axios/axiosGlobal'
import Pagination  from '../pagination'
import axios  from 'axios'
import { debounce } from 'lodash';
import   '../admin.css'

const Ads = ({hideFunc}) => {
   
  //receive hideFunc as a prop, load it with hide whose value is 1
  //to go back to dashboard and hide its contents
   const hide=1;
   hideFunc(hide)

    //store pagination values
     const [ads, setAds] = useState([])
     const [currentPage, setCurrentPage] = useState(1)
     const [lastPage, setLastPage] = useState(1)
     const [total, setTotal] = useState(1)
     const [loadingAds, setLoadingAds] = useState(false)
           
    //get login data
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    const email=loginData && loginData.email;

    //search
    const navigate=useNavigate();
    const refSearch = useRef('')
    const refSearchRes=useRef()
    const [searchRes, setSearchRes] = useState([])
    const [loading, setLoading] = useState(false)

    //const [data, setData] = useState([])
    const [adsNum, setAdsNum] = useState(null)
    const [pageTotal, setPageTotal] = useState(0)

    // loadMore
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchWord, setSearchWord] = useState('')
    const refBtnMore = useRef('')

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

    const refTitle = useRef('')
    const refSmall = useRef('')
    const refFile = useRef('')
    const refPhone = useRef('')
    const refId = useRef('')
    const refAdminCont = useRef()
    const [loadForm, setLoadForm] = useState(false)
    const [responseError, setResponseError] = useState('')
    const [responseOk, setResponseOk] = useState('')
    //additional values
    const refWhats = useRef('')
    const refEmail = useRef('')
    const refWeb = useRef('')
    const refYoutube = useRef('')


    //for making ads pro (tameez)
    const [imgRocketId, setImgRocketId] = useState('')
    const refPackage = useRef('')
    const refRocketId = useRef('')
    const rocketBtn = useRef('')
    const [responseRocket, setResponseRocket] = useState('')
    const [tameezFeature, setTameezFeature] = useState('')

    //admins
    
     
    //get all ads on cpanel
     const getAds=async(page)=>{       
         setLoadingAds(true)
         const res=await axios.get('http://127.0.0.1:8000/api/panel/ads?page='+page);
          //console.log(res.data)
          const allAds=res.data.data
          if(allAds.length>0){
              const country=allAds.map(e=>e.country_id)
              const state=allAds.map(e=>e.state_id)
              const city=allAds.map(e=>e.city_id)
              const cat=allAds.map(e=>e.CAT_ID)
              const subCat=allAds.map(e=>e.subcat_id)
              const user=allAds.map(e=>e.USER_ID)

              const res2= await http.post('/panel/names',{country,state,city,cat,subCat,user});
              //console.log(res2.data.state)
              const countryNames = res2.data.country
              const stateNames = res2.data.state
              const cityNames = res2.data.city
              const catNames = res2.data.cat
              const subCatNames = res2.data.subCat
              const userNames=res2.data.user

                // Set the names directly on each ad item
              const adsWithNames = allAds.map(ad => ({
                    ...ad,
                    countryName: countryNames[ad.country_id],
                    stateName: stateNames[ad.state_id] ,
                    cityName: cityNames[ad.city_id] ,
                    catName: catNames[ad.CAT_ID] ,
                    subCatName: subCatNames[ad.subcat_id] ,
                    userName:userNames[ad.USER_ID]
                }));
                setAds(adsWithNames)
          }
         
          setCurrentPage(res.data.current_page)
          setLastPage(res.data.last_page)
          setTotal(res.data.total)
          setLoadingAds(false)
        
     }


     
    const debouncedFetchAds = useCallback(debounce((page) => {
        getAds(page);
    }, 300), []);


    //call getAds when page loads
    useEffect(() => {
        debouncedFetchAds(currentPage);
        return () => {
            debouncedFetchAds.cancel();
        };
    }, [currentPage, debouncedFetchAds]);


     //when page number changes, set currebtPage
     const changePageFunc=(page)=>{
          setCurrentPage(page)
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


     //edit ads
   const editAd=async(id,NAME,src)=>{
    refAdminCont.current.style.direction='rtl'
    setImgId(id)
    setImgName(NAME)
    setImgSrc(src)
    //api  call
    const res=await http.post('/fields',{id});
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
     refAdminCont.current.style.direction='ltr'

    }

    //start tameezAd (for making ads pro)
    const tameezAd=(id,NAME,src,feature)=>{
        setTameezFeature(feature)
        setImgRocketId(id)
        setImgName(NAME)
        setImgSrc(src)
        document.querySelector('body').style.overflow='hidden';
        refAdminCont.current.style.direction='rtl' //change page direction to rtl
     }

     //hide ad after making pro (tameez)
     const stopTameezAd=()=>{
      setImgRocketId('')
      setResponseRocket('')
       document.querySelector('body').style.overflow='initial';
       //return to direction:ltr
       refAdminCont.current.style.direction='ltr'
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
       const id = parseInt(refRocketId.current.value, 10);//item_id

       //check if empty
       showErrorSelect(plan,'0',refPackage);
      
       //if not empty go ahead
       if(plan!=''  && id!=''   ){
          const adminChange=1;
           //send data
           const res=await http.post('/package',{plan,id,adminChange});
           if(res.data.notice==='success'){
                 //something wrong
                 setResponseRocket('<p class=" green">' +res.data.message+'</p>')
                 alert(res.data.message)
           }else{
                 setResponseRocket('<p class=" red">' +res.data.message+'</p>')
                 alert(res.data.message)
           }
           setLoadForm(false)   
           window.location.reload()      

       }else{
          setLoadForm(false)
          rocketBtn.current.disabled=false;
       }         
    }
    //End tameezAd (making ads pro)


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
    const whatsInput=refWhats.current.value;
    const whats=whatsInput=='' ? 0 : isNaN(parseInt(refWhats.current.value,10))?0:parseInt(refWhats.current.value,10);
    const web=refWeb.current.value;
    const emailSocial=refEmail.current.value;
    const youtube=refYoutube.current.value;

      //check if form values are valid
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
        const res = await axios.post(`http://127.0.0.1:8000/api/ads/update/${id}`, formData);
        
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


     //delete ads
    const deleteItem=async(id)=>{
      //confirm delete
      const confirmed= window.confirm('Do you want to delete this ad?');
      //send id to backend
      if(confirmed){
         const res=await http4.post(`ads/delete/${id}`);
         alert(res.data.message)
         window.location.reload()
      }
    }
  

  //mark row
  const markRow=(ee)=>{
    if( ee.parentElement.style.backgroundColor=='orange'){
        ee.parentElement.style.backgroundColor='white';
    }else{ ee.parentElement.style.backgroundColor='orange' }
  }

  //when clicking on approve, approve ads
  const approveFunc=async(id)=>{
     //confirm delete
     const confirmed= window.confirm('Approve this ad?');
     if(confirmed){
        const res=await http.post('panel/approve',{id});
        alert(res.data.message)
        window.location.reload()
      }
  }

  const returnPendingFunc=async(id)=>{
      //confirm delete
      const confirmed= window.confirm('Return this ad to pending?');
      if(confirmed){
         const res=await http.post('/panel/return-pending',{id});
         alert(res.data.message)
         window.location.reload()
       }
  }


  useEffect(() => {
    !loginData || loginData && loginData.admin==='' && navigate('/');
  }, [])


     
    return (
        <div className='container-fluid top-cont' ref={refAdminCont}>

            {/* making ads pro (tameez) */}
            {imgRocketId && 
             (<div className="overlay edit-overlay">
                 <form  onSubmit={submitFormPackageFunc} className='edit-form py-3 mt-5 mb-3 px-4 rounded-4' >
                     <img className='mx-auto d-block' src={imgSrc} />

                     <div className='head-pro w-fit my-4 mx-auto py-2 px-4 w-50 rounded-2 white'><p className='m-0 w-fit mx-auto fs-5 fw-bold'>تمييز لافتة</p></div>
                    <div>
                        <p className='m-0 fw-bold'>باقة ذهبية </p>
                            <ul>
                              <li>الظهور بحجم كبير في الصفحة الرئيسية</li>
                              <li>اضافة بيانات اتصال مع رابط الوصول للموقع الشخصي</li>
                              <li>أولوية الظهور في نتائج البحث قبل جميع اللافتات</li>
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
                       {tameezFeature==2 ? <option disabled value='1'>ذهبية</option> : <option  value='1'>ذهبية</option>}
                       {tameezFeature==1 ? <option disabled value='2'>فضية</option> : <option  value='2'>فضية</option> }
                       <option value='13'>الغاء تمييز واعادة الى الأصل</option>
                    </select> 
                    
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
              </div>)
             }

            {/* edit images */}
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
                     

                     <label htmlFor="phone" className="d-block mb-2">تليفون محمول </label>
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
                        <small className='w-fit mx-auto mt-0 mb-4 d-block'>رقم واتساب مع رمز الدولة</small>


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


            {loadingAds ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>) 
            : ads && ads.length>0 && (
            <>
            <p>All ads ({total})</p>
            <div className='overflow-auto w-100 pb-5 table-ad-parent' >
                <table className='mb-5 table-ad fs-6' >                   
                   <thead className='bg-info fw-bold'>
                        <tr >
                            <td>id</td>
                            <td>Photo</td>
                            <td>Title</td>
                            <td>Category</td>
                            <td>Sub-Category</td>
                            <td>Country</td>
                            <td>State</td>
                            <td>City</td>
                            <td>Phone</td>
                            <td>Whatsapp</td>
                            <td>Website</td>
                            <td>Email</td>
                            <td>Youtube</td>
                            <td>Approve</td>
                            <td>Feature</td>
                            <td>Plan until</td>
                            <td>user</td> 
                            {loginData.admin ==='sup'||loginData.admin ==='own' &&  //only super admin or owner can do actions
                            <td>Action</td> 
                            }                      
                        </tr>
                    </thead>

                    <tbody>
                       {  ads.map((e)=>(
                        <tr key={e.item_id}  onClick={(ee)=>{markRow(ee.target);}}  >
                            <td>{e.item_id}</td>
                            <td><img onClick={()=>{enlargeFun(baseURLImg+e.photo)}} src={baseURLImg+e.photo} /></td>
                            <td>{e.NAME}</td>
                            <td>{e.catName}</td>
                            <td>{e.subCatName}</td>
                            <td>{e.countryName}</td>
                            <td>{e.stateName}</td>
                            <td>{e.cityName}</td>
                            <td><a href={'tel:0'+e.phone}>{'0'+e.phone}</a></td>
                            <td><a href={'https://wa.me/'+code(e.countryName)+e.whatsapp}>{code(e.countryName)+e.whatsapp}</a></td>
                            <td>{e.website}</td>
                            <td>{e.item_email}</td>
                            <td>{e.youtube}</td>
                            <td>
                              {e.approve==1
                                 ?<><span className="green">shown</span><i title='return to Pending' className='bi bi-x text-danger hand ms-2' onClick={()=>{returnPendingFunc(e.item_id)}}></i></> 
                                 :e.approve==0 
                                    ? <><span title="pending as it\'s new" className="red me-3">pending-new</span><span className='hand text-decoration-underline text-info' onClick={()=>{approveFunc(e.item_id)}}>Approve</span></>
                                    : <><span title='pending as was modefied' className="text-warning me-2">pend-mod</span><span title='Approve again' className='hand text-decoration-underline text-info' onClick={()=>{approveFunc(e.item_id)}}>re-approve  </span></>}
                            </td>
                            <td>{e.feature==2?'Gold':e.feature==1?'Silver':''}</td>
                            <td>{e.plan_until}</td>
                            <td>{e.userName}</td>
                            
                            {loginData.admin ==='sup'||loginData.admin ==='own' && // action ONLY allowed for super admins
                            (<td>
                                <i title='تحرير' className='bi bi-wrench me-5 p-1 bg-info text-light' onClick={()=>{editAd(e.item_id,e.NAME,baseURLImg+e.photo)}} ></i>                      
                                {/* promote and display according to plan*/}
                                {e.feature==2 && <i title='باقة ذهبية'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff-fill p-1 bg-success text-light me-5"></i>}
                                {e.feature==1 && <i title='باقة فضية'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff-fill me-5 bg-yellow text-light p-1 "></i>}
                                {e.feature==0 && <i title='تمييز'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff me-5 bg-secondary text-light p-1"></i>}
                                {/* delete ad*/}
                                <i title='حذف' onClick={()=>{deleteItem(e.item_id)}} className='bi bi-trash bg-danger text-light p-1'></i>
                            </td>)}
                                                                               
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            </>
            ) }
           
        </div>
    )
}

export default Ads


