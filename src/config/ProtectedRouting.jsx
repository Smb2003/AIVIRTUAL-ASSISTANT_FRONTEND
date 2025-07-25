import React, { useEffect, useState } from 'react'
import "../App.css";
import { Navigate, Outlet } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import { getAuth } from '../Context/AuthContext';
import { getVirtualAssistanceData } from '../Context/virtualAssistant';
const ProtectedRouting = () => {
    const [auth,setAuth] = useState(null);
    const {login} = getAuth();
    // console.log("Login form Auth",login)
    useEffect(()=>{
        (async ()=>{
            try {
                const response = await axiosInstance.get("/check");
                console.log("Protected Routing",response?.data);
                if(response?.status == 200){
                    // console.log("Auth After set: ",auth)
                    setAuth(true);
                    login(response?.data?.data);

                }
            } catch (error) {
                setAuth(false);
                login(null);
            }
        })()
    },[])
   
    console.log("Auth Before set: ",auth)
    if(auth == null) return <div className='h-screen flex justify-center items-center'><span className='loader'></span></div>
    return auth == true ? <Outlet/> : <Navigate to="/Login"/>
}

export default ProtectedRouting