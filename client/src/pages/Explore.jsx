import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Filter, MapPin, Maximize, DollarSign, Eye, Send, CheckCircle, TrendingUp, Bed, Bath, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyExchange } from '../hooks/usePropertyExchange';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedFilters = location.state?.filters;

  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { getSalesByLocation } = usePropertyExchange();
  const { getPropertyDetails } = usePropertyRegistry();

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState(passedFilters?.type || 'all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [stateFilter, setStateFilter] = useState('onSale'); // 'all', 'onSale', 'verified'
  
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');

  // Property state names
  const stateNames = ['Registered', 'Verified', 'On Sale', 'Sale Requested', 'Sale Approved', 'Pending Transfer'];

  // Redirect if not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch all properties on sale
  useEffect(() => {
    const fetchProperties = async () => {
      if (isConnected) {
        try {
          setLoading(true);

          // Get properties from all known locations
          // In production, you'd iterate through all possible locations
          // or have a contract method to get all sales globally
          const locationIds = [101, 102, 103, 104, 105]; // Example location IDs
          
          const allProperties = [];

          for (const locationId of locationIds) {
            try {
              const salesByLocation = await getSalesByLocation(locationId);
              
              // Fetch full details for each property
              for (const sale of salesByLocation) {
                try {
                  const propertyDetails = await getPropertyDetails(sale.propertyId);
                  
                  // Only include properties that are on sale and not owned by current user
                  if (sale.state === 0 && propertyDetails.owner.toLowerCase() !== currentAccount.toLowerCase()) {
                    allProperties.push({
                      id: sale.saleId,
                      propertyId: sale.propertyId,
                      title: `Property #${sale.propertyId}`,
                      owner: propertyDetails.owner,
                      ownerWallet: propertyDetails.owner,
                      surveyNo: propertyDetails.surveyNumber,
                      location: `Location ${propertyDetails.locationId}`,
                      locationId: propertyDetails.locationId,
                      area: `${propertyDetails.area} sq ft`,
                      areaValue: propertyDetails.area,
                      price: sale.price,
                      priceETH: parseFloat(sale.price),
                      status: stateNames[propertyDetails.state],
                      stateValue: propertyDetails.state,
                      listedDate: new Date().toLocaleDateString(), // TODO: Get from events
                      views: Math.floor(Math.random() * 300), // Placeholder
                      type: 'Property', // TODO: Add type to contract
                      revenueDeptId: propertyDetails.revenueDepartmentId,
                      saleDetails: sale,
                      propertyDetails: propertyDetails
                    });
                  }
                } catch (err) {
                  console.error('Error fetching property details:', err);
                }
              }
            } catch (err) {
              console.error('Error fetching sales for location:', locationId, err);
            }
          }

          setAvailableProperties(allProperties);

        } catch (error) {
          console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperties();
  }, [isConnected, currentAccount]);

  // Filter properties
  const filteredProperties = availableProperties.filter(property => {
    // Search filter
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.surveyNo.toString().includes(searchQuery) ||
      property.propertyId.toString().includes(searchQuery) ||
      property.ownerWallet.toLowerCase().includes(searchQuery.toLowerCase());
    
    // State filter
    const matchesState = 
      stateFilter === 'all' ||
      (stateFilter === 'onSale' && property.stateValue >= 2) ||
      (stateFilter === 'verified' && property.stateValue === 1);

    // Location filter
    const matchesLocation = locationFilter === 'all' || property.locationId.toString() === locationFilter;
    
    // Price filter
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const priceInETH = property.priceETH;
      if (priceRange === 'low') matchesPrice = priceInETH < 10;
      else if (priceRange === 'medium') matchesPrice = priceInETH >= 10 && priceInETH < 20;
      else if (priceRange === 'high') matchesPrice = priceInETH >= 20;
    }

    return matchesSearch && matchesState && matchesLocation && matchesPrice;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.listedDate) - new Date(a.listedDate);
    if (sortBy === 'priceLow') return a.priceETH - b.priceETH;
    if (sortBy === 'priceHigh') return b.priceETH - a.priceETH;
    if (sortBy === 'popular') return b.views - a.views;
    if (sortBy === 'area') return b.areaValue - a.areaValue;
    return 0;
  });

  // Handle send offer
  const handleSendOffer = (property) => {
    setSelectedProperty(property);
    setOfferPrice(property.price);
    setShowOfferModal(true);
  };

  // Submit offer
  const submitOffer = async () => {
    if (!selectedProperty || !offerPrice) {
      alert('Please enter an offer price');
      return;
    }

    try {
      setLoading(true);

      // Import the hook method
      const { sendPurchaseRequest } = usePropertyExchange();
      
      await sendPurchaseRequest(selectedProperty.id, offerPrice);

      alert('Purchase request sent successfully!');
      setShowOfferModal(false);
      setOfferPrice('');
      setSelectedProperty(null);

    } catch (error) {
      console.error('Error sending offer:', error);
      alert('Failed to send offer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('all');
    setPriceRange('all');
    setLocationFilter('all');
    setStateFilter('onSale');
    setSortBy('latest');
  };

  // Get unique locations for filter
  const uniqueLocations = [...new Set(availableProperties.map(p => p.locationId))];

  // Loading state
  if (web3Loading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="User" walletAdd={currentAccount} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="User" walletAdd={currentAccount} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Properties</h1>
          <p className="text-gray-600">Discover verified properties available for purchase on the blockchain</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
              <h3 className="text-2xl font-bold text-gray-900">{uniqueLocations.length}</h3>
            </div>
            <p className="text-sm text-gray-500">Locations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900">{sortedProperties.length}</h3>
            </div>
            <p className="text-sm text-gray-500">Matching Filters</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Survey #, Location, or Owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="onSale">On Sale</option>
              <option value="verified">Verified Only</option>
            </select>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>Location {loc}</option>
              ))}
            </select>

            {/* Price Range */}
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
          </div>

          {/* Sort */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{sortedProperties.length}</span> of <span className="font-semibold">{availableProperties.length}</span> properties
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              >
                <option value="latest">Latest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="area">Largest Area</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            {(searchQuery || priceRange !== 'all' || locationFilter !== 'all' || stateFilter !== 'onSale') && (
              <button 
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition group">
              {/* Property Header */}
              <div className="relative bg-gradient-to-r from-orange-400 to-orange-500 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold mb-2 inline-block">
                      #{property.propertyId}
                    </span>
                    <h3 className="text-xl font-bold text-white">{property.title}</h3>
                  </div>
                  <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {property.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="bg-orange-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-orange-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-orange-600">{property.price} ETH</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Survey Number</p>
                    <p className="text-sm font-semibold text-gray-900">{property.surveyNo}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Area</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Maximize className="w-3 h-3" />
                      {property.area}
                    </p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Owner</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{property.ownerWallet}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{property.views} views</span>
                  </div>
                  <span>Listed: {property.listedDate}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/property/${property.propertyId}`)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  <button
                    onClick={() => handleSendOffer(property)}
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

        {/* Empty State */}
        {sortedProperties.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'No properties match your search criteria' 
                : 'No properties available for sale at the moment'}
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Make Purchase Offer</h3>
            
            <div className="mb-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Property</p>
                <p className="text-lg font-bold text-gray-900">#{selectedProperty.propertyId}</p>
                <p className="text-sm text-gray-600">Survey: {selectedProperty.surveyNo}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                <p className="text-2xl font-bold text-orange-600">{selectedProperty.price} ETH</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Offer (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.5"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setOfferPrice('');
                  setSelectedProperty(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitOffer}
                disabled={!offerPrice || parseFloat(offerPrice) <= 0}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;