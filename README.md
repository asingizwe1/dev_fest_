 ♻️ CleanChainOperator — Decentralized Waste Management on Base

A blockchain-powered platform to track and incentivize PLASTIC waste collection, bringing transparency and accountability to urban sanitation according to UGANDA'S SUSTAINABLE DEVELOPMENT GOAL 12.5 which emphasizes prevention of dumping

 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Contract Info](#contract-info)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

 About

CleanChainOperator is a decentralized waste management platform deployed on the [Base Mainnet](https://base.org). It provides a real-time, map-based interface to visualize, track, and validate waste collection operations. The platform allows for transparent job assignment and completion, powered by smart contract s.

Originally tested extensively on the Base Sepolia testnet before being deployed live.

Features

-Uses an in app deployed token PPEN(plastic penny) deployed at 0xd975232a55C083f30598EEacA02E71DB4FE04822
- 🗺 Interactive map with custom markers for waste jobs
-  Smart contract-backed verification of job completion
-  Real-time status updates: Pending vs. Completed
-  Integration with Base Mainnet + testnet fallback
-  Future-ready for incentivization via token rewards

 Tech Stack

- Frontend: React + Vite + TypeScript
- Blockchain: Solidity (Base Mainnet)
- Wallet Integration: Ethers.js
- Backend/DB: Supabase
- Mapping: React Leaflet + OpenStreetMap

 Contract Info
PLASTIC PENNY CONTRACT
deployed at: 0xd975232a55C083f30598EEacA02E71DB4FE04822
Hash: 0xf422b20c0a9193b40d1b9981699106e7ce17059d10ea4a7eeb1bce60f3e33c3e

REDEEMING PLASTIC PENNY CONTRACT
Contract Address: 0xe136D48A2E9a8Dc5e44A1607330e9602A1614E0B
Hash: 0xbef9326dd606e02f15bc8d7ff63cfc9311bcc1e3c80646881f547f87f7e16545

PAYMENT CONTRACT
deployed at: 0x69Fd9DCaE5f8A39Ea09F392C99ACC8445DE92207
Hash: 0x82e4f5241fcc41bd138ccd2ec95aebcf3bfa741babe641bfdc42c3909fa7cc9d
Contract Address: 0x69Fd9DCaE5f8A39Ea09F392C99ACC8445DE92207


Getting Started

1. Clone the repo:
   git clone https://github.com/asingizwe1/dev_fest_/tree/master
  
2. Install dependencies:
npm install


3. Start dev server:
   npm run dev

4. Environment variables needed:
VITE_SUPABASE_URL=https://fomswcsgtvdrdcllyljy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXN3Y3NndHZkcmRjbGx5bGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDY5NTYsImV4cCI6MjA2NjAyMjk1Nn0.w5w9QuGfqTuh29ENpinHwGgDeD17YcMezaI3dv0H36g


 Deployment

- Frontend hosted on: [Render]( https://dev-fest.onrender.com/)
- Smart Contracts: Deployed to Base Mainnet

TESTING ENVIRONMENT 
USING BASE SEPOLIA TESTNET
1000PPEN transfer -> transaction hash 0xeb14ceef6a9486d57d911a4dfdbc2f4e8ab8d65dd1a6101ef9229352d3d01724

Transaction ID sor 5.6 PPEN -> TRANSACTION id ->0x9148fc39e66abe7df40c9bafb714d59d3b1362e414d80461a84499e5167ed03b

