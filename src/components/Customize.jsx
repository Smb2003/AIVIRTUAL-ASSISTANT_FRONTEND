import { useEffect, useRef, useState } from 'react';
import Card from './Card';
import { FaFileUpload } from "react-icons/fa";
import { getVirtualAssistanceData } from '../Context/virtualAssistant';
import { useLocation, useNavigate } from 'react-router-dom';
const Customize = () => {
    const [image,setImage] = useState(null);
    const [backendImage,setBackendImage] = useState(null);
    const {selectedImage,setSelectedImage} = getVirtualAssistanceData();
    console.log(location);
    const navigate = useNavigate();

    const imageRef = useRef(null);
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setImage(URL.createObjectURL(file));
            setSelectedImage(file);
        };
    }
    const changePage = (e) => {
        if(selectedImage){
            e.preventDefault();
            location.state = selectedImage;
            navigate("/customizeName",{
                state: { image: selectedImage }
            });
        }
        else{
            return alert("Please select Image.");
        }
    }
  return (
    <div  className='md:h-screen min-h-[100dvh] flex flex-col w-full md:p-10 justify-center items-center bg-gradient-to-t from-black to-blue-900 text-white'>
        <h2 className='md:text-2xl text-3xl py-4 md:py-0'>Select your <span className='text-blue-600'>Assistant Image</span></h2>
        <div className='flex flex-wrap justify-center items-center gap-2 sm:w-[70%] md:w-[90%] w-full p-3 mb-2'>
            <Card image={"../../public/image1.png"}/>
            <Card image={"../../public/image2.jpg"}/>
            <Card image={"../../public/authBg.png"}/>
            <Card image={"../../public/image4.png"}/>
            <Card image={"../../public/image5.png"}/>
            <Card image={"../../public/image6.jpeg"}/>
            <Card image={"../../public/image7.jpeg"}/>
            <div className={`md:w-[150px] md:h-[210px] sm:w-[120px] sm:h-[220px] w-[30%] h-[200px] flex justify-center items-center border  rounded-md bg-blue-900 overflow-hidden hover:backdrop-blur-md hover:shadow-2xl hover:shadow-black hover:border-2 border-white cursor-pointer ${selectedImage == backendImage ? "border-2 border-white" : "border-dashed"}`} 
            onClick={()=>{
                imageRef.current.click()
                setSelectedImage(backendImage)}}>
                {image ?
                    <img src={image} alt='Customize Images.' className={`h-full w-full rounded-md object-cover `}/> 
                :
                <FaFileUpload size={30}/>
                }
                <input type="file" name='image' id='image' accept="image/*" ref={imageRef} onChange={handleImage} className='hidden' />
            </div>
        </div>
        <div className='w-full md:px-[45%] px-[40%]'>
            <button className='rounded-md bg-white text-black w-full px-2 py-2 font-semibold hover:cursor-pointer hover:bg-black hover:text-white hover:border hover: border-dashed'
            onClick={changePage}
            >Next</button>
        </div>
    </div>
  )
}

export default Customize