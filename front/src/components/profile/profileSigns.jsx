import { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router'
import {http} from '../axios/axiosGlobal'
import axios from 'axios'
/*import ShowCat from '../show/showCat'
import ShowSubcat from '../show/showSubcat'*/

import  './profile.css'


const ProfileSigns = () => {
    //get login data
  const loginData=JSON.parse(localStorage.getItem('loginData'));
  const email=loginData && loginData.email;
  const token=localStorage.getItem('token');

    const navigate=useNavigate();
    const [data, setData] = useState([])
    const [adsNum, setAdsNum] = useState(null)
    const [pageTotal, setPageTotal] = useState(null)
    const [loading, setLoading] = useState(false)

    // loadMore
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)
    const refBtnMore = useRef('')

    //enlarge images
    const [enlarge, setEnlarge] = useState('')
    const baseURLImg='http://127.0.0.1:8000/storage/images/';

    //edit form
    const [imgId, setImgId] = useState('')
    const [imgName, setImgName] = useState('')
    const [imgSrc, setImgSrc] = useState('')
    //optional
    const [optPhone, setOptPhone] = useState('')
    const [optWhats, setOptWhats] = useState('')
    const [optEmail, setOptEmail] = useState('')
    const [optWeb, setOptWeb] = useState('')
    const [optYoutube, setOptYoutube] = useState('')
    const [countryId, setCountryId] = useState('')

    const refTitle = useRef('')
    const refSmall = useRef('')
    const refFile = useRef('')
    const refId = useRef('')
    const refEditFeature = useRef(0)
    const [loadForm, setLoadForm] = useState(false)
    const [responseError, setResponseError] = useState('')
    const [responseOk, setResponseOk] = useState('')
    const [editFeature, setEditFeature] = useState('')
    //additional values
    const refPhone = useRef('')
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
    
    
    //get the ads
    const getAds=async()=>{
        //start loading spinner before fetching data
        setLoading(true)
        //fetch data
        const email=loginData.email;
        const postData={email,currentPage};
        const res= await http.post(`/ads/user`,postData);
        setData(res.data.ads)
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
     const res= await http.post(`/ads/user`,postData);
     const newItems = res.data.ads;
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
  
     //edit ads
    const editAd=async(id,NAME,src)=>{
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

  
  useEffect(() => {
      getAds();
  }, [])

  //get country code for whatsapp
  const code=(name)=>{
    if(name==1||name==='مصر'){return '20';} else  if(name==2||name==='السعودية'){return '9660';}
    else  if(name==3||name==='الكويت'){return '9650';} else  if(name==4||name==='الامارات'){return '9710';}
    else  if(name==5||name==='قطر'){return '9740';} else  if(name==6||name==='سلطنة عمان'){return '9680';}
  }


  /*const getCat=async(cat)=>{
      if(cat==1){return 'activ';}else if(cat==2){return 'jobs';}
      else if(cat==3){return 'prod';} else if(cat==4){return 'occa';}
      else if(cat==5){return 'wanted';} else if(cat==6){return 'lost';}
      const res=await http.get('ads/cat/'+cat);
      console.log(res.data.name)
  }*/

  
  
  ///////////////////

    return (
         
         
        <div className='profData-div py-3 px-2' >
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
                                <div className='featured-icons-div d-flex px-1 justify-content-between'>
                                   <div>
                                        {e.phone >0 ? <a href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a><i class="bi bi-telephone-fill empty"></i></a>} 
                                        {e.whatsapp >0 ? <a href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a><i class="bi bi-whatsapp empty"></i></a> } 
                                        {e.website !='' ? <a href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a><i class="bi bi-globe-americas empty"></i></a>} 
                                        {e.item_email !='' ? <a href={'mailto:'+e.item_email} ><i class="bi bi-envelope-at-fill full-env"></i></a> : <a><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                        {e.youtube !='' ? <a href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a><i class="bi bi-youtube empty"></i></a> } 
                                    </div>
                                   {e.approve ==1 ? <i title='معروض' className='bi bi-unlock-fill green'></i> : <i title='في انتظار الموافقة' className='bi bi-lock-fill yellow'></i>} 
                                </div>
                                            
                                <div key={e.item_id} title={e.phone} className='d-flex justify-content-around mt-2'>
                                       {/* edit ad*/}
                                      <i title='تحرير' onClick={(e)=>{editAd(e.target.parentElement.previousSibling.previousSibling.previousSibling.id,e.target.parentElement.previousSibling.previousSibling.previousSibling.alt,e.target.parentElement.previousSibling.previousSibling.previousSibling.src,e.target.parentElement.title)}} className='bi bi-wrench'></i>
                                       {/* promote and display according to plan*/}
                                      {e.feature==2 && <i title='باقة ذهبية'    className="bi bi-rocket-takeoff-fill green"></i>}
                                      {e.feature==1 && <i title='باقة فضية'  onClick={(e)=>{ tameezAd(e.target.parentElement.previousSibling.previousSibling.previousSibling.id,e.target.parentElement.previousSibling.previousSibling.previousSibling.alt,e.target.parentElement.previousSibling.previousSibling.previousSibling.src,e.target.parentElement.previousSibling.previousSibling.previousSibling.name)  }}  className="bi bi-rocket-takeoff-fill yellow"></i>}
                                      {e.feature==0 && <i title='تمييز'  onClick={(e)=>{ tameezAd(e.target.parentElement.previousSibling.previousSibling.previousSibling.id,e.target.parentElement.previousSibling.previousSibling.previousSibling.alt,e.target.parentElement.previousSibling.previousSibling.previousSibling.src,e.target.parentElement.previousSibling.previousSibling.previousSibling.name)  }}  className="bi bi-rocket-takeoff"></i>}
                                       {/* delete ad*/}
                                      <i title='حذف' className='bi bi-trash'></i>
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

export default ProfileSigns
