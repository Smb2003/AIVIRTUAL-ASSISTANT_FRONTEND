import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getVirtualAssistanceData } from '../Context/virtualAssistant';
import { IoArrowBackSharp } from "react-icons/io5";
const CustomizeName = () => {
    const [inputText,setInputText] = useState(null);
    const [loading,setLoading] = useState(false);
    const {submitData,getVirtualAssistantData,editVirtualAssistantData} = getVirtualAssistanceData();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("assistantName", inputText);
        formData.append("image", location?.state?.image || "");
        if(getVirtualAssistantData){
            const isSuccess = await editVirtualAssistantData(formData);
            if(!isSuccess){
                setLoading(true);
                navigate("/customize");
            }
            else{
                setLoading(true);
                navigate(`/virtualAssistant`);
                window.location.reload();
                setLoading(false);
            }
        }
        else{
            const isSuccess = await submitData(formData);
            if(!isSuccess){
                setLoading(true);
                navigate("/customize");
            }
            else{
                setLoading(true);
                navigate(`/virtualAssistant`);
                setLoading(false);
            }
        }
    }
  return (
    <div className='w-full h-screen p-4 flex items-center justify-center bg-gradient-to-t from-black to-blue-950 text-white'>
        <div className='flex flex-col w-[80%] sm:w-[45%] sm:gap-4 gap-6'>
            <div className='absolute top-3 left-4'>
                <IoArrowBackSharp size={20} onClick={()=> navigate("/customize")}/>
            </div>
            <div className='space-y-6'>
                <h1 className='font-semibold md:text-2xl sm:text-2xl text-2xl text-center'>Enter your <span className='text-blue-300'>Assistant Name</span></h1>
                <input 
                type="text"
                name='assistantName'
                id='assistantName'
                required={true}
                value={inputText}
                onChange={(e)=>{setInputText(e.target.value)}}
                placeholder='Enter Assistant Name'
                className='border border-gray-300 rounded-md px-2 sm:py-2 py-3 w-full outline-none'
                />
            </div>
            <div className='w-full  md:px-[20%]'>
                {inputText &&
                    <button className='rounded-md bg-white text-black w-full px-2 py-2 font-semibold hover:cursor-pointer hover:bg-black hover:text-white hover:border hover: border-dashed'
                onClick={handleSubmitForm}
                disabled={loading}> {!loading ? "Finally Create Your Assistant": "Loading"}</button>}
            </div>
        </div>
    </div>
  )
}   

export default CustomizeName