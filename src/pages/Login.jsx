import React, { useState } from 'react'
import authBg from "../assets/authBg.png";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosInstance';
const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login",{email,password});
      console.log(response);
      if(response?.data?.statusCode == 200){
        navigate("/");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Something went wrong."
      setError(errorMsg);
      setTimeout(()=>{
        setError("");
      },2000)
    }
  }
  return (
    <div 
    className={`md:h-screen sm:h-screen h-[100dvh] w-full  flex justify-center items-center bg-[url("/authBg.png")] md:bg-cover bg-contain  `}
    >
    <div className='w-[80%] md:w-[40%] sm:w-[70%] p-6 text-white rounded-md backdrop-blur-md shadow-2xl shadow-black flex flex-col'>
      <h2 className='font-semibold md:text-2xl sm:text-2xl text-xl text-center md:py-5 py-6'>Login to  <span className='text-blue-800 font-bold'>Virtual Assistant</span></h2>
      <form 
      className='text-gray-300' 
      onSubmit={handleSubmit}
      >
        <div className='w-full mb-2'>
          <label className=''>
              Email Address
              <input 
              type="email" 
              name="email" 
              id="email" 
              value={email}
              onChange={(e)=>setEmail(e.target.value)} 
              placeholder='Enter Email Address' 
              className='block w-full px-2 py-2 border border-gray-400 rounded-md mt-2 outline-none'/>
          </label>
        </div>
        <div className='w-full md:mb-3 mb-3'>
          <label className='relative'>
              Password
              <input 
              type={`${showPassword ? "text" : "password"}`} 
              name="password" 
              id="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} 
              placeholder='Enter Password' 
              className=' w-full px-2 py-2 border border-gray-400 rounded-md mt-2 outline-none'
              />
              <span className='absolute right-4 top-10'><button type="button" onClick={()=>setShowPassword(!showPassword)} >{showPassword? <IoEyeOutline/> : <IoEyeOffOutline/>  }</button></span>
          </label>
        </div>
        <div className='mb-2'>
          {error&& <p className='text-lg text-red-500'>{error}</p>}
        </div>
        <div className='mb-2 md:px-[45%] sm:px-[45%]'>
          <button 
          type="submit"
          className='rounded-md w-full sm:w-fit py-2 px-2 border border-gray-400 bg-white text-black hover:cursor-pointer'
          >login</button>
        </div>
        <div className=''>
          <p className='text-center'>Don't have any account <Link to="/register" className='text-black underline'> Sign Up</Link> </p>
          
        </div>
      </form>
    </div>
    </div>
  )
}

export default Login