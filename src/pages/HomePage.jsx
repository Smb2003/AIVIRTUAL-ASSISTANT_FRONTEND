import { React, useEffect, useState } from 'react';
import AudioGif from "/user.gif";
import { getVirtualAssistanceData } from '../Context/virtualAssistant';
import { getAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const HomePage = () => {
  const { getVirtualAssistantData,gemini, geminiResponse } = getVirtualAssistanceData();
  const navigate = useNavigate();
  const { logOut } = getAuth();
  const [triggerWord,setTriggerWord] = useState(null);
  const [singleUser,setSingleUser] = useState(null);
  const [spoken, setSpoken] = useState(false);
  const {user} = getAuth();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleSubmitForm = async () => {
    await logOut();
    navigate("/Login");
  };
  
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const waitForVoices = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        clearInterval(waitForVoices);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = synth.getVoices().find(v => v.lang == 'en-US');
        utterance.lang = 'en-US';
        utterance.rate = 1 
        utterance.pitch = 3;
        utterance.volume = 10;
        synth.speak(utterance);
      }
    }, 100);
  };

  const handleCommand = (data)  => {
    const {type,userinput,response} = data;
    speakText(response);
    
    if(type == "google_search"){
      const query = encodeURIComponent(userinput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank')
      
    }
    if(type == "calculator_open"){
      window.open(`https://www.google.com/search?q=calculator`,'_blank')
    }
    if(type == "instagram_open"){
      window.open(`https://www.instagram.com/`,'_blank')
    }
    if(type == "facebook_open"){
      window.open(`https://www.facebook.com/`,'_blank')
    }
    if(type == "weather_show"){
      const query = encodeURIComponent(userinput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank')
    }
    if(type == "youtube_search" || type == "youtube_play"){
      const query = encodeURIComponent(userinput);
      console.log("Query: ",query);
      setTimeout(() => {
        console.log("first")
        const win = window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        if (!win) {
          alert("Popup blocked! Please allow popups for this site.");
        }
      }, 100);
      
    }
  }

  useEffect(()=>{
    setSingleUser(getVirtualAssistantData || null);
    setTriggerWord(getVirtualAssistantData?.assistantName?.toLowerCase());
  },[getVirtualAssistantData])
  
  useEffect(()=>{
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  },[browserSupportsSpeechRecognition])
  
  useEffect(()=>{
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });

    return () => {
      console.log("unmount")
      SpeechRecognition.abortListening();
    };
  },[])

  useEffect(()=>{
    const processTranscript = async () => {
      const spokenText = transcript?.toLowerCase();
      if (spokenText.includes(triggerWord) && !spoken) {
        setSpoken(true);

        const response = await gemini(spokenText);
          handleCommand(response);
        
        // setTimeout(() => {
        //   console.log("SetTimeOutCalled;")
        //   handleCommand(response);
        // }, 200);

        setTimeout(() => {
          resetTranscript();
          setSpoken(false); 
        }, 4000);
      }
    };

    processTranscript();
  },[transcript])
  
  
  return (
    <div className='relative'>
      <div className='h-screen w-full flex flex-col justify-center items-center gap-16 bg-gradient-to-t from-black from-20% to-blue-950'>
        <div className='w-[200px] h-[250px] space-y-2'>
          <img src={singleUser && singleUser?.image} alt='Assistant Image' className='w-full h-full rounded-md object-cover' />
          <h1 className='text-white text-center font-semibold'>I'm {singleUser && singleUser?.assistantName}</h1>
        </div>
        <div>
          <img src={AudioGif} alt="" className='w-[150px] h-[100px]' />
        </div>
        <div>
          {/* <div><button className='text-white' onClick={()=>{speakText(geminiResponse?.response)}}>Speak</button></div> */}
          {(transcript)&&
            <p className="text-white font-xl ">{geminiResponse?.response}</p>}
        </div>
        
      </div>
      <div className='absolute top-2 right-2 '>
        <button className='rounded-md bg-white text-black w-full px-2 py-2 font-semibold hover:cursor-pointer hover:bg-black hover:text-white hover:border hover:border-dashed'
          onClick={handleSubmitForm}> LogOut</button>
      </div>
      <div className='absolute top-16 right-2 '>
        <button className='rounded-md bg-white text-black w-full px-2 py-2 font-semibold hover:cursor-pointer hover:bg-black hover:text-white hover:border hover:border-dashed'
          onClick={()=>{
            navigate("/customize");
          }}> Customize</button>
      </div>
    </div>
  );
};

export default HomePage;
