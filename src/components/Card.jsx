import React from 'react'
import { getVirtualAssistanceData } from '../Context/virtualAssistant'

const Card = ({image}) => {
  const {selectedImage,setSelectedImage} = getVirtualAssistanceData();
  console.log("Selected Image: ",selectedImage)
  return (
    <div 
    className={`md:w-[150px] md:h-[210px] sm:w-[120px] sm:h-[220px] w-[30%] h-[200px] border border-black ${selectedImage == image ? "border-2 border-white":"border-dashed"} rounded-md overflow-hidden hover:backdrop-blur-md hover:shadow-2xl hover:shadow-black hover:border-2 hover:border-white cursor-pointer`}
    onClick={()=>{setSelectedImage(image)}}
    >
        <img src={image} alt='Customize Images.' className='h-full w-full rounded-md object-cover'/>
    </div>
  )
}

export default Card