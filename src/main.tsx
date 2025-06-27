import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
/////
import React from "react";
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers'; // ✅ If using ethers v5
/////

function getLibrary(provider: any): Web3Provider {
    return new Web3Provider(provider);
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <App />
        </Web3ReactProvider>
    </React.StrictMode>
);

