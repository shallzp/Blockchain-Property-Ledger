import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Eye, DollarSign, CheckCircle, Clock, Plus, Search, FileText, Send } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';
import { usePropertyExchange } from '../hooks/usePropertyExchange';


const Properties = () => {
  const navigate = useNavigate();

  const navItems = useNavItems();

  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { getPropertiesOfOwner } = usePropertyRegistry();
  const { getMySales, addPropertyOnSale } = usePropertyExchange();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'verified', 'pending', 'onSale'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [salePrice, setSalePrice] = useState('');

  const stateNames = ['Registered', 'Verified', 'On Sale', 'Sale Requested', 'Sale Approved', 'Pending Transfer'];
  const stateColors = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100 text-green-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-purple-100 text-purple-700',
    4: 'bg-indigo-100 text-indigo-700',
    5: 'bg-pink-100 text-pink-700'
  };

  // Redirect if wallet not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch properties and sales
  useEffect(() => {
    const fetchProperties = async () => {
      if (isConnected && currentAccount) {
        try {
          setLoading(true);
          const userProperties = await getPropertiesOfOwner(currentAccount);
          setProperties(userProperties);
          setFilteredProperties(userProperties);

          const userSales = await getMySales(currentAccount);
          setSales(userSales);

        } catch (error) {
          console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProperties();
  }, [isConnected, currentAccount, getPropertiesOfOwner, getMySales]);

  // Filter properties according to tab and search
  useEffect(() => {
    let filtered = [...properties];

    if (activeTab === 'verified') {
      filtered = filtered.filter(p => p.state === 1);
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(p => p.state === 0);
    } else if (activeTab === 'onSale') {
      filtered = filtered.filter(p => p.state >= 2);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.propertyId.toString().includes(searchQuery) ||
        p.surveyNumber.toString().includes(searchQuery) ||
        p.locationId.toString().includes(searchQuery)
      );
    }

    setFilteredProperties(filtered);
  }, [activeTab, searchQuery, properties]);

  const handlePutOnSale = async () => {
    if (!salePrice || parseFloat(salePrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      setLoading(true);
      await addPropertyOnSale(selectedProperty.propertyId, salePrice);
      alert('Property listed for sale successfully!');
      setShowSaleModal(false);
      setSalePrice('');

      const userProperties = await getPropertiesOfOwner(currentAccount);
      setProperties(userProperties);
    } catch (error) {
      console.error('Error listing property:', error);
      alert('Failed to list property: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (web3Loading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="User" walletAdd={currentAccount} navItems={navItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="User" walletAdd={currentAccount} navItems={navItems} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
            <p className="text-gray-600">Manage and view all your registered properties</p>
          </div>
          <button
            onClick={() => navigate('/add-property')}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Property
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">Total Properties</h3>
              <Home className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">Verified</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{properties.filter(p => p.state === 1).length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">Pending</h3>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{properties.filter(p => p.state === 0).length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">On Sale</h3>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{properties.filter(p => p.state >= 2).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'verified' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verified ({properties.filter(p => p.state === 1).length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({properties.filter(p => p.state === 0).length})
              </button>
              <button
                onClick={() => setActiveTab('onSale')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'onSale' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                On Sale ({properties.filter(p => p.state >= 2).length})
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or Survey #"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'No properties match your search criteria'
                : 'You haven\'t registered any properties yet'}
            </p>
            <button
              onClick={() => navigate('/add-property')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.propertyId}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition group"
              >
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-lg">
                      Property #{property.propertyId}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${stateColors[property.state]}`}>
                      {stateNames[property.state]}
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm">Survey: {property.surveyNumber}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        Location ID
                      </span>
                      <span className="text-sm font-medium text-gray-900">{property.locationId}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Maximize className="w-4 h-4 text-orange-500" />
                        Area
                      </span>
                      <span className="text-sm font-medium text-gray-900">{property.area} sq ft</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue Dept</span>
                      <span className="text-sm font-medium text-gray-900">{property.revenueDepartmentId}</span>
                    </div>

                    {property.marketValue > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          Market Value
                        </span>
                        <span className="text-lg font-bold text-green-600">{property.marketValue} ETH</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/property/${property.propertyId}`)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    {property.state === 1 && (
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowSaleModal(true);
                        }}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <DollarSign className="w-4 h-4" />
                        Sell
                      </button>
                    )}

                    {property.state >= 2 && (
                      <button
                        onClick={() => navigate(`/requests?propertyId=${property.propertyId}`)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Requests
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for listing property for sale */}
        {showSaleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">List Property for Sale</h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Property #{selectedProperty?.propertyId} - Survey: {selectedProperty?.surveyNumber}
                </p>

                <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.5"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaleModal(false);
                    setSalePrice('');
                    setSelectedProperty(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePutOnSale}
                  disabled={!salePrice || parseFloat(salePrice) <= 0}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  List for Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
