// Place these interface definitions at the very top of your file if you want type safety:
interface Product {
  id?: number;
  product_name: string;
  price: number;
  category: string;
  description: string;
  product_images: string | null;
}
import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Package,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  ArrowLeft,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient'; // Ensure this path points to your configured Supabase client

interface LogisticsOrgDashboardProps {
  onBack: () => void;
  onMarketplace: () => void;
}

const LogisticsOrgDashboard = ({ onBack, onMarketplace }: LogisticsOrgDashboardProps) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImageURL, setProductImageURL] = useState<string | null>(null);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy analytics data
  const analyticsData = [
    { month: 'Jan', collections: 45, weight: 120 },
    { month: 'Feb', collections: 52, weight: 140 },
    { month: 'Mar', collections: 68, weight: 180 },
    { month: 'Apr', collections: 71, weight: 195 },
    { month: 'May', collections: 89, weight: 230 },
    { month: 'Jun', collections: 94, weight: 250 },
  ];

  const wasteTypeData = [
    { name: 'Bottles', value: 35, color: '#10b981' },
    { name: 'Bags', value: 25, color: '#3b82f6' },
    { name: 'Containers', value: 20, color: '#8b5cf6' },
    { name: 'Packaging', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#ef4444' },
  ];

  const analyticsOptions = [
    { title: "Weekly Collection Trends", price: "50 USDT", description: "Detailed waste collection patterns by region" },
    { title: "Peak Collection Times", price: "35 USDT", description: "Optimal timing analysis for waste management" },
    { title: "User Engagement Metrics", price: "45 USDT", description: "Community participation and retention data" },
    { title: "Environmental Impact Report", price: "75 USDT", description: "CO2 reduction and sustainability metrics" },
    { title: "Waste Type Distribution", price: "40 USDT", description: "Plastic categorization and volume analysis" },
    { title: "Geographic Heat Maps", price: "60 USDT", description: "Collection density and coverage mapping" },
  ];

  // Fetch listed products from Supabase to display
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('PRODUCT TABLE')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error.message);
      } else if (data) {
        // Map database fields (uppercase) into your UI shape:
        setListedProducts(
          data.map((item: any) => ({
            id: item.id,
            product_name: item.PRODUCT_NAME,
            price: item.PRICE,
            category: item.CATEGORY,
            description: item.DESCRIPTION,
            product_images: item.PRODUCT_IMAGES,
          }))
        );
      }
    };

    fetchProducts();
  }, []);

  // Replicate the image-upload logic
  const handleImageUpload = async () => {
    if (!productImage) return null;
    console.log("Uploading image:", productImage.name);
    const filePath = `product_images/${Date.now()}_${productImage.name}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, productImage);

    if (error) {
      console.error('Image upload failed:', error.message);
      toast({ title: 'Image upload failed', variant: 'destructive' });
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  };

  const handleAddProduct = async () => {
    // Validate required fields
    if (!productName.trim() || !productPrice.trim() || !category.trim() || !productDescription.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    const priceNumber = Number(productPrice);
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast({ title: 'Invalid price', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // Upload the image (if provided)
    let imageUrl: string | null = null;
    if (productImage) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) {
        setIsSubmitting(false);
        return;
      }
    }

    // Insert product details into Supabase
    const { error } = await supabase
      .from('PRODUCT TABLE')
      .insert([
        {
          PRODUCT_NAME: productName,
          PRICE: priceNumber,
          CATEGORY: category,
          DESCRIPTION: productDescription,
          PRODUCT_IMAGES: imageUrl || null,
        },
      ]);

    setIsSubmitting(false);

    if (error) {
      console.error('Submission failed:', error.message);
      toast({ title: 'Submission failed', variant: 'destructive' });
    } else {
      toast({ title: 'Product added to marketplace!' });
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setCategory('');
      if (productImageURL) URL.revokeObjectURL(productImageURL);
      setProductImage(null);
      setProductImageURL(null);
      // Optionally re-fetch products here
    }
  };

  const handlePurchaseAnalytics = async (item: string, price: string) => {
    try {
      // Set up provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum); // assumes MetaMask or similar
      const signer = await provider.getSigner();

      // Define your contract address and ABI
      const contractAddress = '0xdef685F9C502D055343BAC1A1d635AfDE808888b';

      const contractABI = [{ "type": "constructor", "inputs": [{ "name": "_appWallet", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" }, { "type": "receive", "stateMutability": "payable" }, { "type": "function", "name": "addProductWithPayment", "inputs": [{ "name": "productName", "type": "string", "internalType": "string" }, { "name": "price", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "payable" }, { "type": "function", "name": "appWallet", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "emergencyWithdraw", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "receiveLogisticsPayment", "inputs": [], "outputs": [], "stateMutability": "payable" }, { "type": "function", "name": "receiveUserPayment", "inputs": [], "outputs": [], "stateMutability": "payable" }, { "type": "function", "name": "updateAppWallet", "inputs": [{ "name": "_newWallet", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "LogisticsPaymentReceived", "inputs": [{ "name": "org", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "ProductAddedWithPayment", "inputs": [{ "name": "org", "type": "address", "indexed": true, "internalType": "address" }, { "name": "productName", "type": "string", "indexed": false, "internalType": "string" }, { "name": "price", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "UserPaymentReceived", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }];
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Define how much ETH to send (e.g., 0.00025 ETH ≈ $0.50 at some rate)
      const amountInEth = '0.00025'; // adjust as needed
      const tx = await contract.receiveUserPayment({
        value: ethers.parseEther(amountInEth)
      });

      await tx.wait();

      // Show download link
      toast({
        title: '✅ Payment Complete',
        description: `Access granted to ${item}. Download: https://drive.google.com/sample-report`,
      });

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: '❌ Payment Error',
        description: 'Something went wrong during the transaction.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-purple-700">Logistics Organization Dashboard</h1>
                <p className="text-sm text-gray-600">Waste Processing & Analytics Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
                <DollarSign className="w-4 h-4 mr-2" /> $2,340 Revenue
              </Badge>
              {/* <Button onClick={onMarketplace} className="bg-purple-600 hover:bg-purple-700">
                Marketplace
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md">
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            <TabsTrigger value="marketplace-mgmt">Marketplace Management</TabsTrigger>
            <TabsTrigger value="data-store">Data Store</TabsTrigger>
          </TabsList>

          {/* Analytics Dashboard Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Package className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Collections</p>
                      <p className="text-2xl font-bold text-green-700">{analyticsData.reduce((sum, d) => sum + d.collections, 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Weight</p>
                      <p className="text-2xl font-bold text-blue-700">{analyticsData.reduce((sum, d) => sum + d.weight, 0)}kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-purple-700">892</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-8 h-8 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Coverage Areas</p>
                      <p className="text-2xl font-bold text-indigo-700">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">Collection Trends</CardTitle>
                  <CardDescription>Monthly waste collection volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="weight" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Waste Type Distribution</CardTitle>
                  <CardDescription>Breakdown by plastic type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                      >
                        {wasteTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Marketplace Management Tab */}
          <TabsContent value="marketplace-mgmt" className="space-y-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add Biodegradable Product
                </CardTitle>
                <CardDescription>
                  List eco-friendly products for PPEN token redemption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        placeholder="e.g., Bamboo Toothbrush Set"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-price">Price (PPEN Tokens)</Label>
                      <Input
                        id="product-price"
                        type="number"
                        placeholder="e.g., 25"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-category">Category</Label>
                      <select
                        id="product-category"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select category</option>
                        <option value="household">Household Items</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="food">Food Products</option>
                        <option value="clothing">Eco Clothing</option>
                        <option value="gardening">Gardening Supplies</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product-description">Description</Label>
                      <textarea
                        id="product-description"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Describe your biodegradable product..."
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Product Images</Label>
                      {/* Image upload area with hidden input */}
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                          <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload product images</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setProductImage(file);
                          if (file) {
                            const url = URL.createObjectURL(file);
                            if (productImageURL) URL.revokeObjectURL(productImageURL);
                            setProductImageURL(url);
                          } else {
                            if (productImageURL) URL.revokeObjectURL(productImageURL);
                            setProductImageURL(null);
                          }
                        }}
                      />
                      {/* Preview uploaded image */}
                      {productImageURL && (
                        <img
                          src={productImageURL}
                          alt="Preview"
                          className="mt-2 rounded-lg max-h-40 object-cover mx-auto"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  disabled={isSubmitting}
                  onClick={handleAddProduct}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isSubmitting ? 'Adding Product...' : 'Add Product to Marketplace'}
                </Button>
              </CardContent>
            </Card>

            {/* Current Products */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Your Listed Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {listedProducts.length > 0 ? (
                    listedProducts.map((product, index) => (
                      <Card key={product.id || index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{product.product_name}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-600 font-medium">{product.price} PPEN</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">Products will be listed upon verification.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Store Tab */}
          <TabsContent value="data-store" className="space-y-6">
            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <Eye className="w-5 h-5 mr-2" />
                  Premium Analytics Store
                </CardTitle>
                <CardDescription>
                  Purchase detailed environmental and user analytics data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {analyticsOptions.map((item, idx) => (
                    <Card key={idx} className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-indigo-600">{item.price}</span>
                            <Button
                              onClick={() => handlePurchaseAnalytics(item.title, item.price)}
                              variant="outline"
                              className="border-indigo-200 hover:bg-indigo-50"
                            >
                              Purchase Access
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

export default LogisticsOrgDashboard;
