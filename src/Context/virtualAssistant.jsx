import React, { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../config/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from './AuthContext';

const virtualAssistant = createContext();

const VirtualAssistant = ({children}) => {
    const [selectedImage,setSelectedImage] = useState(null);
    const [virtualAssistantData,setVirtualAssistantData] = useState(null);
    const [getVirtualAssistantData,setGetVirtualAssistantData] = useState(null);
    const [geminiResponse,setGeminiResponse] = useState(null);
    const [error,setError] = useState("");
    const {user} = getAuth();
    console.log(user);
    const submitData = async (data) => {
      try {
          const response = await axiosInstance.post("/addData",data);
          if(response?.data?.statusCode == 200){
            setVirtualAssistantData(response?.data?.data);
            setError(null);
            return true;
          }
      } catch (error) {
          console.log("Error: ",error);
          setError(error?.response?.data?.message);
          setVirtualAssistantData(null);
          return false;
      }
    }
    useEffect(()=>{
      if (!user?._id) return; // wait for user to load
      (async ()=>{
          try {
          const response = await axiosInstance.get("/getData");
          if(response?.data?.statusCode == 200){
            console.log("data: ",response?.data?.data);
            const data = response?.data?.data;
            console.log(data);

            const matchedItem = data?.find((item) => {
              console.log("Item Owner: ", item?.owner?.toString());
              console.log("User ID: ", user?._id?.toString());

              return item?.owner?.toString() === user?._id?.toString();
            });
            console.log(matchedItem);
            setGetVirtualAssistantData(matchedItem);
          }
        } catch (error) {
          console.log("Error: ",error?.response?.data?.message);
          setGetVirtualAssistantData(null);
        }}
      )()
    },[user])
    const editVirtualAssistantData = (data) => {
      
      (async () => {
        try {
          const response = await axiosInstance.post("/editData",data);
          if(response?.data?.statusCode == 200){
            setGetVirtualAssistantData(response?.data?.data[0]);
            return true
          }
        } catch (error) {
          console.log("Error on updation: ",error);
          return false;
        }

      })();
    }
    const gemini = async (command) => {
      console.log("command",command);
      try {
        const response = await axiosInstance.post("/askToAssistant",{
          command
        })
        console.log("Gemini Response From Backend: ",response);
        if(response?.data?.statusCode == 200){
          setGeminiResponse(response?.data?.data);
          return response?.data?.data;
        }else {
        console.warn("Unexpected status code:", response?.data?.statusCode);
      }
      } catch (error) {
        console.log("Error: ",error?.response?.data?.message);
        setGeminiResponse(error);
      }
    }
  return (
    <virtualAssistant.Provider value={{setSelectedImage,selectedImage,submitData,virtualAssistantData,setVirtualAssistantData,getVirtualAssistantData,setGetVirtualAssistantData,gemini,geminiResponse,editVirtualAssistantData}}>
        {children}
    </virtualAssistant.Provider>
  )
}
export const getVirtualAssistanceData = () => useContext(virtualAssistant);
export default VirtualAssistant;