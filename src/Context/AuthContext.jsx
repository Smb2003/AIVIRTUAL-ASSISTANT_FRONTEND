import React, { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../config/AxiosInstance';

const authContext = createContext();
const AuthContext = ({children}) => {
    const [user,setUser] = useState(null);
   
    const login = (data) => {
        setUser(data);
    }
    const logOut = async () => {
        return axiosInstance.post("/logOut")
        .then(()=>{
            setUser(null);
        })
    }
    useEffect(()=>{
        (async ()=>{
            try {
                const response = await axiosInstance.get("/check");
                // console.log(response);
                if(response?.status == 200){
                    setUser(response?.data?.data)
                }
            } catch (error) {
                setUser(null);
            }
        })()
    },[])
    return (
    <authContext.Provider value={{user,login,logOut}}>
        {children}
    </authContext.Provider>
  )
}
export const getAuth = () => (useContext(authContext));
export default AuthContext