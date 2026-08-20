import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {NotificationProvider} from './contexts/notificationContext.jsx'
import {DialogProvider} from './contexts/dialogContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    <BrowserRouter>
      <NotificationProvider>
        <DialogProvider>
          <App />
        </DialogProvider>
      </NotificationProvider>  
    </BrowserRouter>
  </StrictMode>
)
