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
  const [transcript,setTranscript ] = useState('');

  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition
  // } = useSpeechRecognition();

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
    console.log(response);
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
      setTimeout(() => {
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
  

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("Mic started automatically");
    };

    recognition.onresult = async (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      console.log("Result :", result);

      const spokenText = result.toLowerCase();
      setTranscript(spokenText)
      if (spokenText.includes(triggerWord) && !spoken) {
        setSpoken(true);

        const response = await gemini(spokenText);
        handleCommand(response);

        setTimeout(() => {
          setSpoken(false);
          setTranscript("")

        }, 4000);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognition.onend = () => {
      console.log("Restarting mic...");
      recognition.start();
    };

    return () => {
      recognition.stop();
    };
  }, [triggerWord]);

  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => console.log("🎤 Access granted — stream active"))
      .catch(err => console.error("❌ Mic error:", err));
  }, []);
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
