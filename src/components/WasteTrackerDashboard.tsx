interface WasteSubmission {
  id: number;
  waste_type: string;
  weight: number;
  description?: string;
  latitude?: string;
  longitude?: string;
  submitted_by
  : string;
}

type TransformedJob = {
  id: number;
  type: string;
  weight: number;
  location: string;
  user: string;
  distance: string;
  reward: string;
};
interface CompletedJob {
  id: number;
  type: string;
  weight: number;
  location: string;
  user: string;
  reward: string;
  completedAt: string;
}


//import { PlasticPennyABI } from '@/lib/abi/PlasticPenny';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, CheckCircle, Clock, Navigation, Coins, ArrowLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
///map
import { ErrorBoundary } from "@/components/ErrorBoundary"; // adjust path as needed
////start
import { formatUnits, getAddress } from 'ethers';


import WasteMap from './WasteMap';
import { supabase } from '@/lib/supabaseClient';
// import WasteMap from "./WasteMap"; // adjust path as needed
/////start
const CONTRACT_ADDRESS = "0xd975232a55C083f30598EEacA02E71DB4FE04822";//for the tokens
const PlasticPennyABI = [{ "type": "constructor", "inputs": [{ "name": "initialSupply", "type": "uint256", "internalType": "uint256" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "allowance", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "spender", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "approve", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "balanceOf", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "burn", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "decimals", "inputs": [], "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }], "stateMutability": "view" }, { "type": "function", "name": "mint", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "name", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" }, { "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "transfer", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "transferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "Approval", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "spender", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "Transfer", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "error", "name": "ERC20InsufficientAllowance", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, { "name": "allowance", "type": "uint256", "internalType": "uint256" }, { "name": "needed", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "ERC20InsufficientBalance", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, { "name": "balance", "type": "uint256", "internalType": "uint256" }, { "name": "needed", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "ERC20InvalidApprover", "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC20InvalidReceiver", "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC20InvalidSender", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC20InvalidSpender", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }];


/////start

interface WasteTrackerDashboardProps {
  onBack: () => void;
  onMarketplace: () => void;
}
///////
// -- Contract function definition outside the component --
import { ethers, BrowserProvider, parseUnits } from 'ethers';
//const [loading, setLoading] = useState(true);
const awardTokens = async (recipient: string, amount: number) => {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, PlasticPennyABI, signer);

  const tx = await contract.awardTokens(
    recipient,
    parseUnits(amount.toString(), 18)
  );

  await tx.wait();
};
///////////

/////start
const WasteTrackerDashboard = ({ onBack, onMarketplace }: WasteTrackerDashboardProps) => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  ///start


  ///START
  // const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  ///start
  console.log(
    'URL →', import.meta.env.VITE_SUPABASE_URL,
    'KEY length →', import.meta.env.VITE_SUPABASE_ANON_KEY?.length
  );
  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from('waste_table')
        .select('*')
        .eq('status', 'submitted');

      if (error) {
        console.error('Error fetching submissions:', error.message);
      } else if (data) {
        // Type assertion: adjust as needed
        setSubmissions(data as WasteSubmission[]);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      const { data, error } = await supabase
        .from('waste_table')
        .select('*')
        .eq('status', 'accepted');

      if (error) {
        console.error('Error fetching completed jobs:', error.message);
      } else if (data) {
        const transformed = data.map((job) => ({
          id: job.id,
          type: job.waste_type,
          weight: job.weight,
          location: job.description ?? 'Unknown',
          user: job.submitted_by,
          reward: `${(job.weight * 0.1).toFixed(1)} PPEN`,
          completedAt: new Date(job.updated_at || job.created_at).toLocaleString() // if timestamp exists
        }));

        setCompletedJobs(transformed);
      }
    };

    fetchCompletedJobs();
  }, []);
  ///
  const wasteCollections = [
    { id: 1, type: "Plastic Bottles", weight: "3.2kg", location: "Downtown Park", user: "Alice Johnson", distance: "0.8km", reward: "3.2 PPEN", status: "pending" },
    { id: 2, type: "Food Containers", weight: "2.1kg", location: "Shopping Mall", user: "Bob Wilson", distance: "1.2km", reward: "2.1 PPEN", status: "pending" },
    { id: 3, type: "Plastic Bags", weight: "1.8kg", location: "Beach Area", user: "Carol Davis", distance: "2.5km", reward: "1.8 PPEN", status: "pending" },
  ];
  /////start

  const jobsToDisplay = submissions.map((job) => ({
    id: job.id,
    type: job.waste_type,
    weight: `${job.weight} kg`,
    location: job.description ?? "Unknown",
    user: job.submitted_by
    ,
    distance: "—",
    reward: `${(job.weight * 1.0).toFixed(1)} PPEN`  // → use numeric weight

  }));

  //const completedJobs = [
  //  { id: 4, type: "Mixed Plastics", weight: "4.5kg", location: "City Center", user: "David Brown", reward: "4.5 PPEN", completedAt: "2 hours ago" },
  // { id: 5, type: "Bottle Collection", weight: "2.8kg", location: "Park District", user: "Emma Wilson", reward: "2.8 PPEN", completedAt: "1 day ago" },
  //];
  /////start
  // …inside WasteTrackerDashboard component
  const handleAcceptJob = async (job: WasteSubmission) => {
    // 1️⃣ Mark job accepted in Supabase
    const { error: acceptErr } = await supabase
      .from('waste_table')
      .update({ status: 'accepted' })
      .eq('id', job.id);
    if (acceptErr) {
      console.error('Error accepting job:', acceptErr);
      return;
    }

    // 2️⃣ Calculate tokens
    const tokensToAward = job.weight * 0.1;

    // 3️⃣ Trigger on-chain transfer from user's wallet
    try {
      if (!window.ethereum) {
        alert('Please connect a wallet like MetaMask');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        '0xd975232a55C083f30598EEacA02E71DB4FE04822', // replace this!
        PlasticPennyABI,
        signer
      );

      const amount = parseUnits(tokensToAward.toString(), 18);
      const tx = await contract.transfer(job.submitted_by, amount);
      await tx.wait();
      const txHash = tx.hash;

      // 4️⃣ Update off-chain user_wallet balance
      const { data: wallet, error: fetchBalErr } = await supabase
        .from('user_wallet')
        .select('token_balance')
        .eq('account', job.submitted_by)
        .single();
      if (fetchBalErr) {
        console.error('Failed to fetch balance:', fetchBalErr);
        return;
      }

      const newBalance = (wallet.token_balance ?? 0) + tokensToAward;
      const { error: updateBalErr } = await supabase
        .from('user_wallet')
        .update({ token_balance: newBalance })
        .eq('account', job.submitted_by);
      if (updateBalErr) {
        console.error('Failed to update balance:', updateBalErr);
        return;
      }

      // 5️⃣ Mark tokens_awarded
      await supabase
        .from('waste_table')
        .update({ tokens_awarded: true })
        .eq('id', job.id);

      // 6️⃣ Toast
      toast({
        title: 'Job Accepted!',
        description: `Sent ${tokensToAward.toFixed(1)} PPEN (tx ${txHash})`,
      });
      const newCompleted: CompletedJob = {
        id: job.id,
        type: job.waste_type,
        weight: job.weight,
        location: job.description ?? 'Unknown',
        user: job.submitted_by,
        reward: `${tokensToAward.toFixed(1)} PPEN`,
        completedAt: 'just now'
      };

      setCompletedJobs(prev => [...prev, newCompleted]);

      // Optionally remove from submissions (so it disappears from Available Jobs)
      setSubmissions(prev => prev.filter(j => j.id !== job.id));
    } catch (err) {
      console.error('On-chain transfer failed:', err);
      toast({
        title: 'Transfer failed',
        description: 'Could not complete token transfer. Check wallet and try again.',
      });
    }
  };



  const handleCompleteJob = (jobId: number) => {
    toast({
      title: "Job Completed!",
      description: "Transaction signed and verified on blockchain. PPEN tokens have been awarded.",
    });
  };


  ////////start
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      // Destructure both data and error here:
      const { data: pending, error: pendingError } = await supabase
        .from('waste_table')

        .select('*');
      // .eq('status', 'submitted');   ← you can re-enable this once you confirm the status values

      // Now both variables exist:
      console.log('pending fetch →', { pending, pendingError });

      if (pendingError) {
        console.error('Supabase fetch error:', pendingError);
      }

      if (pending) {
        setSubmissions(pending as WasteSubmission[]);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  /* useEffect(() => {
     // Initialize a simple map representation
     if (mapRef.current) {
       mapRef.current.innerHTML = `
         <div class="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
           <div class="absolute inset-0 opacity-20">
             <svg viewBox="0 0 400 300" class="w-full h-full">
               <!-- Streets -->
               <line x1="0" y1="100" x2="400" y2="100" stroke="#666" stroke-width="2"/>
               <line x1="0" y1="200" x2="400" y2="200" stroke="#666" stroke-width="2"/>
               <line x1="100" y1="0" x2="100" y2="300" stroke="#666" stroke-width="2"/>
               <line x1="300" y1="0" x2="300" y2="300" stroke="#666" stroke-width="2"/>
             </svg>
           </div>
           <!-- Waste Collection Points -->
           <div class="absolute top-16 left-20 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
           <div class="absolute top-32 left-48 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
           <div class="absolute top-24 left-72 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
           <div class="absolute bottom-20 left-32 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
           <div class="absolute bottom-16 right-20 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
           
           <!-- Current Location -->
           <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg">
             <div class="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
           </div>
           
           <!-- Legend -->
           <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
             <div class="flex items-center space-x-2 mb-1">
               <div class="w-3 h-3 bg-red-500 rounded-full"></div>
               <span>Pending Collections</span>
             </div>
             <div class="flex items-center space-x-2 mb-1">
               <div class="w-3 h-3 bg-green-500 rounded-full"></div>
               <span>Completed</span>
             </div>
             <div class="flex items-center space-x-2">
               <div class="w-3 h-3 bg-blue-600 rounded-full"></div>
               <span>Your Location</span>
             </div>
           </div>
         </div>
       `;
     }
 }, []); */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">Waste Tracker Dashboard</h1>
                <p className="text-sm text-gray-600">Collection & Verification Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
                <Coins className="w-4 h-4 mr-2" />
                189.7 PPEN
              </Badge>
              {/* <Button onClick={onMarketplace} className="bg-blue-600 hover:bg-blue-700">
                Marketplace
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="map-view" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md">
            <TabsTrigger value="map-view">GPS Map View</TabsTrigger>
            <TabsTrigger value="available-jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="completed-jobs">Completed Jobs</TabsTrigger>
          </TabsList>

          {/* Map View Tab */}
          <TabsContent value="map-view" className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <MapPin className="w-5 h-5 mr-2" />
                  Live Waste Collection Map
                </CardTitle>
                <CardDescription>
                  View GPS-mapped waste locations and optimize your collection routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div style={{ height: "500px", border: "2px dashed red" }}>

                    {/* <ErrorBoundary>
  <WasteMap />
</ErrorBoundary> */}
                    <WasteMap />

                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-red-700">Pending Collections</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-green-700">Completed Today</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">8.2km</div>
                        <div className="text-sm text-blue-700">Optimal Route</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Jobs Tab */}
          <TabsContent value="available-jobs" className="space-y-6">
            <div className="grid gap-4">
              {loading ? (
                <p className="text-center text-blue-600">Loading jobs...</p>
              ) : submissions.length === 0 ? (
                <p className="text-center text-gray-500">No jobs available right now.</p>
              ) : (
                submissions.map((job) => (
                  <Card key={job.id} className="border-yellow-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-lg">{job.waste_type}</h4>
                            <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Submitted by: {job.submitted_by}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Location: {job.latitude && job.longitude ? `${job.latitude}, ${job.longitude}` : "Unknown"}
                            </div>
                            <div>Weight: {job.weight}kg</div>
                            <div className="flex items-center">
                              <Navigation className="w-4 h-4 mr-2" /> —
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-blue-800">
                              Reward: {job.weight.toFixed(1)} PPEN

                            </div>
                            <div className="text-xs text-blue-600">Plus verification bonus</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button onClick={() => handleAcceptJob(job)}>Accept Job</Button>
                          <Button variant="outline" size="sm" className="w-full">View Route</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Completed Jobs Tab */}
          <TabsContent value="completed-jobs" className="space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Completed Collections
                </CardTitle>
                <CardDescription>
                  Your verified waste collection history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h4 className="font-semibold">{job.type}</h4>
                        <p className="text-sm text-gray-600">
                          {job.weight} • {job.location} • Collected from {job.user}
                        </p>
                        <p className="text-xs text-gray-500">Completed {job.completedAt}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          +{job.reward}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Blockchain Verified</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WasteTrackerDashboard;
//function setPendingJobs(pending: any[]) {
// throw new Error('Function not implemented.');
//}

