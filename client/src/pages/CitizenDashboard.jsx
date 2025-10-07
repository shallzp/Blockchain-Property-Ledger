import React, { useState } from 'react';
import { Home, Search, MapPin, Bed, Bath, Maximize, ChevronRight, Calendar, Star, User, FileText, Send, Eye } from 'lucide-react';

import Navbar from '../components/Navbar';
import useWeb3 from '../utils/useWeb3.js';

const CitizenDashboard = () => {
  const [propertyType, setPropertyType] = useState('Villa');
  const [searchFilters, setSearchFilters] = useState({
    bedrooms: 3,
    bathrooms: 2,
    type: 'Villa'
  });

  // Mock user role - you can replace this with actual role from smart contract
  const userRole = 'Land Owner'; // Can be: 'Super Admin', 'Local Admin', 'Land Owner', 'Buyer'

  const { walletAddress } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navigation */}
      <Navbar userRole={ userRole } walletAdd={ walletAddress } ></Navbar>

      {/* Hero Section */}
      <div className="relative px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Content Area */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{
            height: '500px'
          }}>
            {/* Property Type Filters */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              <button 
                onClick={() => setPropertyType('All')}
                className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium transition ${
                  propertyType === 'All' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                <Home className="inline w-4 h-4 mr-1" /> All
              </button>
              <button 
                onClick={() => setPropertyType('Villa')}
                className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium transition ${
                  propertyType === 'Villa' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                Villa
              </button>
              <button 
                onClick={() => setPropertyType('Apartment')}
                className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium transition ${
                  propertyType === 'Apartment' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                Apartment
              </button>
              <button 
                onClick={() => setPropertyType('House')}
                className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium transition ${
                  propertyType === 'House' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                House
              </button>
              <button 
                onClick={() => setPropertyType('Land')}
                className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium transition ${
                  propertyType === 'Land' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                Land
              </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80" 
                alt="Luxury Villa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-orange-900/40"></div>
            </div>

            {/* Property Price Tag */}
            {/* <div className="absolute top-1/3 right-32 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="text-3xl font-bold text-orange-600">5.2 ETH</div>
              <div className="text-sm text-gray-500">Property #47</div>
            </div> */}

            {/* Left Search Card */}
            <div className="absolute left-8 bottom-8 bg-white/95 backdrop-blur-sm rounded-3xl p-6 w-96 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Find Your Property On Blockchain</span>
                <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Verified</span>
              </div>

              <div className="flex gap-2 mb-6">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                  <Home className="w-4 h-4" /> Buy Property
                </button>
                <button className="flex-1 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition">
                  For Sale
                </button>
                <button className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/30">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Find Verified<br />Property Records
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Transparent, secure, and immutable blockchain-based property registry
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">{searchFilters.bedrooms}-Bedroom</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bath className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">{searchFilters.bathrooms}-Bathroom</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Home className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">{searchFilters.type}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow shadow-lg shadow-orange-500/30">
                Search Properties
              </button>
            </div>

            {/* Right Property Card */}
            <div className="absolute right-8 bottom-8 bg-white/95 backdrop-blur-sm rounded-3xl p-6 w-80 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  GS
                </div>
                <span className="text-sm font-medium text-gray-600">+28 Documents</span>
                <button className="ml-auto p-2 hover:bg-orange-50 rounded-full transition">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">Golden Springfield</h3>
              <p className="text-sm text-gray-500 mb-4">Plot 2821Z - Lake Sevilla, Beverly Hills</p>

              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">4</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">3</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">6x78.5 m²</span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700">Blockchain Verified</span>
                </div>
                <p className="text-xs text-gray-600">Last verified: 2 hours ago</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Owner Distance</span>
                </div>
                <span className="text-sm font-medium text-gray-800">18.2 KM</span>
              </div>
            </div>

            {/* Nearby Button */}
            {/* <button className="absolute right-8 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-orange-500/90 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition shadow-lg">
              <MapPin className="w-4 h-4" /> Nearby
            </button> */}

            {/* For Sale Status Tag */}
            {/* <div className="absolute left-32 top-1/3 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-orange-500/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Available Properties</div>
                <div className="text-xs text-white/90">For Sale on Chain</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Stats Section */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">24</h3>
              <p className="text-sm text-gray-500">Your Properties</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">8</h3>
              <p className="text-sm text-gray-500">Active Requests</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">12</h3>
              <p className="text-sm text-gray-500">Requested Properties</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-purple-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">156</h3>
              <p className="text-sm text-gray-500">Total Available</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;