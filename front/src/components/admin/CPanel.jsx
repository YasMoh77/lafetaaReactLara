
import {useEffect,useState,useRef,useCallback} from 'react'
import {Link, Routes,Route} from 'react-router-dom'
import { useNavigate } from 'react-router'
import {http} from '../axios/axiosGlobal'
import Pagination  from './pagination'
import axios  from 'axios'
import { debounce } from 'lodash';
import   './admin.css'

const CPanel = () => {
    //store pagination values
     const [ads, setAds] = useState([])
     const [currentPage, setCurrentPage] = useState(1)
     const [lastPage, setLastPage] = useState(1)
     const [total, setTotal] = useState(1)
     const [loadingAdmin, setLoadingAdmin] = useState(false)
           
    //get login data
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    const email=loginData && loginData.email;
    const token=localStorage.getItem('token');

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
    //const [currentPage, setCurrentPage] = useState(1)
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
    const refEditFeature = useRef(0)
    const refAdminCont = useRef()
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
     
    //get all ads on cpanel
     const getAds=async(page)=>{
        try {
            setLoadingAdmin(true)
         const res=await axios.get('http://127.0.0.1:8000/api/panel/index?page='+page);
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
          setLoadingAdmin(false)
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error('Too many requests. Please try again later.');
            } else {
                console.error('Error fetching ads:', error);
            }
        }
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
    console.log(id,NAME,src)
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
                 //something wrong
                 setResponseRocket('<p class=" red">' +res.data.message+'</p>')
                 setLoadForm(false)

              //proceed to pay
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
              
                //redirect to pay by visa
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
        const res = await axios.post(`http://127.0.0.1:8000/api/ads/update/${id}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'X-Requested-With': 'XMLHttpRequest',
              Authorization:'Bearer '+token
          },
        });
        
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


     
    return (
        <div className='container-fluid top-cont' ref={refAdminCont}>
            <p>All ads ({total})</p>

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


            {loadingAdmin ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>) : (
            <div className='overflow-auto w-100 pb-5 table-ad-parent' >
                <table className='mb-5 table-ad' >                   
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
                            <td>Action</td>                       
                        </tr>
                    </thead>

                    <tbody>
                       { ads && ads.length>0 && ads.map((e)=>(
                        <tr key={e.item_id} >
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
                            <td>{e.approve==1?<span className="green">shown</span>:e.approve==0?<span className="red">pending-new</span>:<span className="yellow">pending-modify</span>}</td>
                            <td>{e.feature==2?'Gold':e.feature==1?'Silver':''}</td>
                            <td>{e.plan_until}</td>
                            <td>{e.userName}</td>
                            <td>
                                <i title='Edit' className='bi bi-wrench me-5 p-1 bg-info text-light' onClick={()=>{editAd(e.item_id,e.NAME,baseURLImg+e.photo)}} ></i>                      
                                {/* promote and display according to plan*/}
                                {e.feature==2 && <i title='باقة ذهبية'    className="bi bi-rocket-takeoff-fill p-1 bg-success text-light me-5"></i>}
                                {e.feature==1 && <i title='باقة فضية'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff-fill yellow me-5"></i>}
                                {e.feature==0 && <i title='تمييز'  onClick={()=>{ tameezAd(e.item_id,e.NAME,baseURLImg+e.photo,e.feature)  }}  className="bi bi-rocket-takeoff me-5 bg-secondary text-light p-1"></i>}
                                {/* delete ad*/}
                                <i title='حذف' className='bi bi-trash bg-danger text-light p-1'></i>
                            </td> 
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            ) }
           
        </div>
    )
}

export default CPanel


