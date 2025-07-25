import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './Context/AuthContext.jsx'
import VirtualAssistant from './Context/virtualAssistant.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
      <VirtualAssistant>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VirtualAssistant>
    </AuthContext>
  </StrictMode>,
)
