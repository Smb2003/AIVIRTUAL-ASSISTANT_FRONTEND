import { useEffect, useState } from "react";
import axiosInstance from "../config/AxiosInstance";
import { getAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "../App.css";
const RedirectHandler = () => {
  const [virtualAssistant, setVirtualAssistant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = getAuth();

  useEffect(() => {
    if (!user?._id) return; 

    const fetchDataOfVirtualAssistant = async () => {
      try {
        const response = await axiosInstance("/getData");
        const data = response?.data?.data;

        console.log("RESPONSE:", data);
        const filterData = data?.filter(
          (item) => item?.owner?.toString() === user?._id?.toString()
        );

        console.log("Filtered:", filterData);
        setVirtualAssistant(filterData?.length > 0 ? filterData : null);
      } catch (error) {
        console.log("Error:", error?.response?.data?.message);
        setVirtualAssistant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDataOfVirtualAssistant();
  }, [user]);

  useEffect(() => {
    console.log("Virtual Assistant (state):", virtualAssistant);
  }, [virtualAssistant]);

  if (loading) return <div className='h-screen flex justify-center items-center'><span className='loader'></span></div>;

  return virtualAssistant?.length > 0 ? (
    <Navigate to="/virtualAssistant" replace />
  ) : (
    <Navigate to="/customize" replace />
  );
};

export default RedirectHandler;
