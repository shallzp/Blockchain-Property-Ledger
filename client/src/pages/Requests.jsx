import React, { useState } from 'react';
import { Send, Clock, CheckCircle, XCircle, Eye, Home, MapPin, User, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const Requests = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Requests sent by current user to buy properties
  const sentRequests = [
    {
      id: 1,
      propertyId: '#892',
      property: 'Lake View Mansion',
      location: 'Powai, Mumbai',
      seller: 'Jane Smith',
      sellerWallet: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      offerPrice: '18.2 ETH',
      status: 'pending',
      sentDate: '2024-10-08',
      message: 'Interested in purchasing this property. Ready for immediate transaction.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'
    },
    {
      id: 2,
      propertyId: '#4521',
      property: 'Golden Springfield Villa',
      location: 'Juhu, Mumbai',
      seller: 'John Doe',
      sellerWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0A13f',
      offerPrice: '12.5 ETH',
      status: 'accepted',
      sentDate: '2024-10-05',
      acceptedDate: '2024-10-06',
      message: 'Very interested in this property. Can we proceed with the sale?',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'
    },
    {
      id: 3,
      propertyId: '#3341',
      property: 'Downtown Apartment',
      location: 'Bandra West, Mumbai',
      seller: 'Amit Kumar',
      sellerWallet: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      offerPrice: '6.5 ETH',
      status: 'rejected',
      sentDate: '2024-10-02',
      rejectedDate: '2024-10-03',
      message: 'Would like to buy this apartment.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'
    }
  ];

  const filteredRequests = sentRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const stats = {
    total: sentRequests.length,
    pending: sentRequests.filter(r => r.status === 'pending').length,
    accepted: sentRequests.filter(r => r.status === 'accepted').length,
    rejected: sentRequests.filter(r => r.status === 'rejected').length
  };

  const handleCancelRequest = (requestId) => {
    console.log('Canceling request:', requestId);
    // TODO: Call contract function to cancel request
  };

  const handleConfirmPurchase = (requestId) => {
    console.log('Confirming purchase:', requestId);
    // TODO: Call contract function to complete purchase
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Citizen" walletAdd="0x742d...89f3" />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Purchase Requests</h1>
          <p className="text-gray-600">Track all property purchase requests you've sent</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-sm text-gray-500">Total Requests</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100 bg-orange-50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
            <p className="text-sm text-gray-500">Pending Response</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.accepted}</h3>
            <p className="text-sm text-gray-500">Accepted</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.rejected}</h3>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Filter by Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('accepted')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'accepted'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'rejected'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                request.status === 'pending' ? 'border-orange-200' :
                request.status === 'accepted' ? 'border-green-200' :
                'border-gray-200'
              }`}
            >
              <div className="flex gap-6">
                {/* Property Image */}
                <div className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={request.image} 
                    alt={request.property}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Request Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-bold">
                          {request.propertyId}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">{request.property}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{request.location}</span>
                      </div>
                    </div>

                    <div>
                      {request.status === 'pending' && (
                        <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      {request.status === 'accepted' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Accepted
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Seller</p>
                      <p className="text-sm font-semibold text-gray-900">{request.seller}</p>
                      <p className="text-xs text-gray-600 font-mono mt-1">{request.sellerWallet}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Your Offer</p>
                      <p className="text-2xl font-bold text-orange-600">{request.offerPrice}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-xs text-blue-600 font-semibold mb-2">Your Message</p>
                    <p className="text-sm text-blue-900">{request.message}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Sent: {request.sentDate}</span>
                      </div>
                      {request.acceptedDate && (
                        <div className="flex items-center gap-2 mt-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Accepted: {request.acceptedDate}</span>
                        </div>
                      )}
                      {request.rejectedDate && (
                        <div className="flex items-center gap-2 mt-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>Rejected: {request.rejectedDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Request
                        </button>
                      )}
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => handleConfirmPurchase(request.id)}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete Purchase
                        </button>
                      )}
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-6">You haven't sent any purchase requests yet</p>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">
              Explore Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;