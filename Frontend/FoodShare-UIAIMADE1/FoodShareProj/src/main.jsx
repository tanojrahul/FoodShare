import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Set root element to be full height
document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.getElementById('root').style.height = '100%'
document.getElementById('root').style.margin = '0'
document.getElementById('root').style.padding = '0'
// Remove overflow hidden to enable scrolling
// document.getElementById('root').style.overflow = 'hidden'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
