import React, { useState } from 'react';
import { Home, Search, Filter, MapPin, Maximize, DollarSign, Eye, Send, CheckCircle, TrendingUp, Bed, Bath } from 'lucide-react';
import Navbar from '../components/Navbar';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [location, setLocation] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const availableProperties = [
    {
      id: 1,
      propertyId: '#892',
      title: 'Lake View Mansion',
      owner: 'Jane Smith',
      ownerWallet: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      surveyNo: 'MH/MUM/2024/0892',
      location: 'Powai, Mumbai',
      area: '760 sq.m',
      bedrooms: 5,
      bathrooms: 4,
      price: '18.2 ETH',
      priceUSD: '$45,500',
      status: 'verified',
      listedDate: '2024-10-01',
      views: 142,
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'
    },
    {
      id: 2,
      propertyId: '#3341',
      title: 'Downtown Apartment',
      owner: 'Amit Kumar',
      ownerWallet: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      surveyNo: 'MH/MUM/2024/3341',
      location: 'Bandra West, Mumbai',
      area: '240 sq.m',
      bedrooms: 3,
      bathrooms: 2,
      price: '6.5 ETH',
      priceUSD: '$16,250',
      status: 'verified',
      listedDate: '2024-10-05',
      views: 89,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'
    },
    {
      id: 3,
      propertyId: '#7823',
      title: 'Beachfront Villa',
      owner: 'Priya Sharma',
      ownerWallet: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      surveyNo: 'MH/MUM/2024/7823',
      location: 'Juhu Beach, Mumbai',
      area: '920 sq.m',
      bedrooms: 6,
      bathrooms: 5,
      price: '25.8 ETH',
      priceUSD: '$64,500',
      status: 'verified',
      listedDate: '2024-09-28',
      views: 256,
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'
    },
    {
      id: 4,
      propertyId: '#4512',
      title: 'Garden House',
      owner: 'Rajesh Patel',
      ownerWallet: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      surveyNo: 'MH/MUM/2024/4512',
      location: 'Andheri East, Mumbai',
      area: '340 sq.m',
      bedrooms: 4,
      bathrooms: 3,
      price: '9.2 ETH',
      priceUSD: '$23,000',
      status: 'verified',
      listedDate: '2024-10-03',
      views: 67,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'
    },
    {
      id: 5,
      propertyId: '#2156',
      title: 'Commercial Plot',
      owner: 'Suresh Menon',
      ownerWallet: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      surveyNo: 'MH/MUM/2024/2156',
      location: 'BKC, Mumbai',
      area: '1200 sq.m',
      bedrooms: 0,
      bathrooms: 0,
      price: '45.0 ETH',
      priceUSD: '$112,500',
      status: 'verified',
      listedDate: '2024-09-25',
      views: 198,
      type: 'Land',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'
    }
  ];

  const filteredProperties = availableProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.propertyId.includes(searchQuery);
    
    const matchesType = propertyType === 'all' || property.type === propertyType;
    const matchesLocation = location === 'all' || property.location.includes(location);
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const priceInETH = parseFloat(property.price);
      if (priceRange === 'low') matchesPrice = priceInETH < 10;
      else if (priceRange === 'medium') matchesPrice = priceInETH >= 10 && priceInETH < 20;
      else if (priceRange === 'high') matchesPrice = priceInETH >= 20;
    }

    return matchesSearch && matchesType && matchesLocation && matchesPrice;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.listedDate) - new Date(a.listedDate);
    if (sortBy === 'priceLow') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'priceHigh') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'popular') return b.views - a.views;
    return 0;
  });

  const handleSendRequest = (propertyId) => {
    console.log('Sending purchase request for property:', propertyId);
    // TODO: Call contract function to send purchase request
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Citizen" walletAdd="0x742d...89f3" />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Properties</h1>
          <p className="text-gray-600">Discover verified properties available for purchase on the blockchain</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900">{availableProperties.length}</h3>
            </div>
            <p className="text-sm text-gray-500">Available Properties</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">100%</h3>
            </div>
            <p className="text-sm text-gray-500">Blockchain Verified</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-8 h-8 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">Mumbai</h3>
            </div>
            <p className="text-sm text-gray-500">Your Region</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
            </div>
            <p className="text-sm text-gray-500">New This Week</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, or property ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Land">Land</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Prices</option>
              <option value="low">Under 10 ETH</option>
              <option value="medium">10-20 ETH</option>
              <option value="high">Above 20 ETH</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            >
              <option value="latest">Latest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{sortedProperties.length}</span> of <span className="font-semibold">{availableProperties.length}</span> properties
            </p>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition group">
              {/* Property Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-xs font-bold">
                    {property.propertyId}
                  </span>
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-medium">
                    {property.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="text-lg font-bold text-orange-600">{property.price}</p>
                    <p className="text-xs text-gray-500">{property.priceUSD}</p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Area</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Maximize className="w-3 h-3" />
                      {property.area}
                    </p>
                  </div>
                  {property.bedrooms > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Rooms</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Bed className="w-3 h-3" /> {property.bedrooms}
                        <Bath className="w-3 h-3 ml-1" /> {property.bathrooms}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Owner</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {property.owner.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{property.owner}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{property.views} views</span>
                  </div>
                  <span>Listed: {property.listedDate}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleSendRequest(property.id)}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Make Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProperties.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setPropertyType('all');
                setPriceRange('all');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;