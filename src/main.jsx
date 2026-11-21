
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { CartProvider } from './context/CartContext'
import { CompareProvider } from './context/CompareContext'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <CompareProvider>
        <App />
      </CompareProvider>
    </CartProvider>
  </React.StrictMode>
)
