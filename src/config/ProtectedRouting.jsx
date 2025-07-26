import React, { useEffect, useState } from 'react'
import "../App.css";
import { Navigate, Outlet } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import { getAuth } from '../Context/AuthContext';
const ProtectedRouting = () => {
    const [auth,setAuth] = useState(null);
    const {login} = getAuth();
    useEffect(()=>{
        (async ()=>{
            try {
                const response = await axiosInstance.get("/check");
                console.log("Protected Routing",response?.data);
                if(response?.status == 200){
                    setAuth(true);
                    login(response?.data?.data);

                }
            } catch (error) {
                setAuth(false);
                login(null);
            }
        })()
    },[])

    if(auth == null) return <div className='h-screen flex justify-center items-center'><span className='loader'></span></div>
    return auth == true ? <Outlet/> : <Navigate to="/Login"/>
}

export default ProtectedRouting