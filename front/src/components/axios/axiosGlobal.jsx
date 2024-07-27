import axios from 'axios'


    //for forms without files
export const   http=axios.create({
        baseURL:'http://127.0.0.1:8000/api',
        headers:{'X-Requested-With':'XMLHttpRequest'},
        withCredentials:true
    })
 
    
    //for forms with files
export const   http2=axios.create({
        baseURL:'http://127.0.0.1:8000/api',
        headers:{
            'Content-Type': 'multipart/form-data',
            'X-Requested-With':'XMLHttpRequest'
        },
        withCredentials:true
    })

    //for forms without files
export const   http3=axios.create({
    baseURL:'http://127.0.0.1:8000/web',
    headers:{'X-Requested-With':'XMLHttpRequest'},
    withCredentials:true
})


 
