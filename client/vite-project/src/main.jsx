import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WalletProvider } from './context/WalletProvider.jsx'
import { SymbolProvider } from './context/SymbolProvider.jsx'
// import { WalletProvider } from './context/WalletContext.jsx'
import {BrowserRouter}from "react-router-dom";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SymbolProvider>
    <WalletProvider>
<App />
    </WalletProvider>
    </SymbolProvider>
  </BrowserRouter>
  </StrictMode>,
)
