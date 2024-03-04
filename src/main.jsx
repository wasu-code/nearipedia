import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './theme.css'
import { Toaster } from "@/components/ui/sonner"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position={'top-center'}
      closeButton
      visibleToasts={1}
      toastOptions={{
        duration: 9999999
      }} />
  </React.StrictMode>,
)
