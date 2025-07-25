import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from "./pages/SignUp.jsx"
import Login from './pages/Login.jsx'
import HomePage from './pages/HomePage.jsx'
import ProtectedRouting from './config/ProtectedRouting.jsx'
import Customize from './components/Customize.jsx'
import CustomizeName from './components/CustomizeName.jsx'
import { getVirtualAssistanceData } from './Context/virtualAssistant.jsx'
import RedirectHandler from './pages/RedirectHandler.jsx'
function App() {
  const {virtualAssistantData} = getVirtualAssistanceData();
  console.log("V: ",virtualAssistantData)
  
  return (
    <>
     <Routes>
      <Route path='/register' element={<SignUp/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route element={<ProtectedRouting/>}>
        <Route path='/' element={<RedirectHandler/>}/>
        <Route path='/virtualAssistant' element={<HomePage/>}/>
        <Route path='/customize' element={<Customize/>}/>
        <Route path='/customizeName' element={<CustomizeName/>}/>
      </Route>
     </Routes>
    </>
  )
}

export default App
