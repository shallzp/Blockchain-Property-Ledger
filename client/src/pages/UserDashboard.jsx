import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Home, Search, MapPin, Bed, Bath, Maximize, ChevronRight, Calendar, Star, User, FileText, Send, Eye } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';
import { usePropertyExchange } from '../hooks/usePropertyExchange';

const UserDashboard = () => {
  const [propertyType, setPropertyType] = useState('Villa');
  const [searchFilters, setSearchFilters] = useState({
    bedrooms: 3,
    bathrooms: 2,
    type: 'Villa'
  });
  const [userProperties, setUserProperties] = useState([]);
  const [activeSales, setActiveSales] = useState([]);
  const [requestedProperties, setRequestedProperties] = useState([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get Web3 context
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  
  // Get contract hooks
  const { getPropertiesOfOwner } = usePropertyRegistry();
  const { getMySales, getRequestedSales } = usePropertyExchange();

  const navigate = useNavigate();

  // Redirect to landing if not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate("/");
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch user data when connected
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && currentAccount) {
        try {
          setLoading(true);

          // Fetch user's properties
          const properties = await getPropertiesOfOwner(currentAccount);
          setUserProperties(properties);

          // Fetch user's active sales
          const sales = await getMySales(currentAccount);
          setActiveSales(sales.filter(sale => sale.state === 0)); // Active state

          // Fetch requested properties
          const requests = await getRequestedSales(currentAccount);
          setRequestedProperties(requests);

          // TODO: Fetch total available properties from blockchain
          // This would require a new contract method to get all properties on sale
          setTotalAvailable(156); // Placeholder

        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isConnected, currentAccount]);

  // Show loading state
  if (web3Loading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle search
  const handleSearch = () => {
    navigate('/explore', { 
      state: { 
        filters: searchFilters,
        propertyType 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navigation */}
      <Navbar userRole="User" walletAdd={currentAccount} />

      {/* Hero Section */}
      <div className="relative px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Area */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: '600px' }}>
            
            {/* Property Type Filters */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              {['All', 'Villa', 'Apartment', 'House', 'Land'].map((type) => (
                <button 
                  key={type}
                  onClick={() => {
                    setPropertyType(type);
                    setSearchFilters(prev => ({ ...prev, type }));
                  }}
                  className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium transition ${
                    propertyType === type 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  {type === 'All' && <Home className="inline w-4 h-4 mr-1" />}
                  {type}
                </button>
              ))}
            </div>

            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80" 
                alt="Luxury Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-orange-900/40"></div>
            </div>

            {/* Left Search Card */}
            <div className="absolute left-8 bottom-8 bg-white/95 backdrop-blur-sm rounded-3xl p-6 w-110 opacity-90 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Find Your Property On Blockchain</span>
                <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Verified</span>
              </div>

              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => navigate('/explore')}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                >
                  <Home className="w-4 h-4" /> Buy Property
                </button>
                <button 
                  onClick={() => navigate('/properties')}
                  className="flex-1 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition"
                >
                  For Sale
                </button>
                <button 
                  onClick={handleSearch}
                  className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/30"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Find Verified<br />Property Records
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Transparent, secure, and immutable blockchain-based property registry
              </p>

              {/* Filter Controls */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="w-5 h-5 text-orange-500" />
                  <select 
                    value={searchFilters.bedrooms}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                    className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}-Bedroom</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bath className="w-5 h-5 text-orange-500" />
                  <select 
                    value={searchFilters.bathrooms}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                    className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}-Bathroom</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Home className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">{searchFilters.type}</span>
                </div>
              </div>

              <button 
                onClick={handleSearch}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow shadow-lg shadow-orange-500/30"
              >
                Search Properties
              </button>
            </div>

            {/* Right Property Card - Show first property or placeholder */}
            <div className="absolute right-8 bottom-8 bg-white/95 backdrop-blur-sm rounded-3xl p-6 w-80 shadow-xl opacity-90">
              {userProperties.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      #{userProperties[0].propertyId}
                    </div>
                    <span className="text-sm font-medium text-gray-600">Property Documents</span>
                    <button 
                      onClick={() => navigate(`/property/${userProperties[0].propertyId}`)}
                      className="ml-auto p-2 hover:bg-orange-50 rounded-full transition"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Property #{userProperties[0].propertyId}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Survey: {userProperties[0].surveyNumber} - Location: {userProperties[0].locationId}
                  </p>

                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">{userProperties[0].area} sq ft</span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-700">
                        {userProperties[0].state === 1 ? 'Blockchain Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Owner: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Location ID</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {userProperties[0].locationId}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Properties Yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Register your first property to get started
                  </p>
                  <button 
                    onClick={() => navigate('/add-property')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition"
                  >
                    Add Property
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section - Dynamic Data */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-6 mt-8">
            {/* Your Properties */}
            <button
              onClick={() => navigate('/properties')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {userProperties.length}
              </h3>
              <p className="text-sm text-gray-500">Your Properties</p>
            </button>

            {/* Active Requests */}
            <button
              onClick={() => navigate('/requests')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {activeSales.length}
              </h3>
              <p className="text-sm text-gray-500">Active Sales</p>
            </button>

            {/* Requested Properties */}
            <button
              onClick={() => navigate('/requested')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {requestedProperties.length}
              </h3>
              <p className="text-sm text-gray-500">Requested Properties</p>
            </button>

            {/* Total Available */}
            <button
              onClick={() => navigate('/explore')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-purple-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {totalAvailable}
              </h3>
              <p className="text-sm text-gray-500">Total Available</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;