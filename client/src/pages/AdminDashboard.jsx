import React, { useState } from 'react';
import { Home, Users, FileText, CheckCircle, XCircle, Search, Filter, Upload, MapPin, Calendar, Eye, TrendingUp, AlertCircle, Clock, Building2, FileCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const adminRegion = 'Mumbai';
  
  const stats = {
    region: adminRegion,
    totalUsers: 234,
    verifiedUsers: 198,
    pendingKYC: 12,
    totalProperties: 145,
    verifiedProperties: 132,
    pendingProperties: 8,
    activeListings: 42,
    pendingTransfers: 6
  };

  const pendingKYC = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0A13f', 
      email: 'rajesh.kumar@email.com',
      aadhaar: 'XXXX-XXXX-4521',
      phone: '+91 98765-43210',
      requestDate: '2024-10-08',
      documents: ['Aadhaar', 'PAN', 'Address Proof']
    }
  ];

  const handleApproveKYC = (userId) => {
    console.log('Approving KYC for user:', userId);
  };

  const handleRejectKYC = (userId) => {
    console.log('Rejecting KYC for user:', userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Local Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Region: {stats.region} • Managing local property records</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Local Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Users</p>
            <div className="mt-2 text-xs text-gray-600">
              <span className="text-green-600 font-semibold">{stats.verifiedUsers} verified</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Home className="w-8 h-8 text-green-500" />
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Properties</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalProperties}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Properties</p>
            <div className="mt-2 text-xs text-gray-600">
              <span className="text-green-600 font-semibold">{stats.verifiedProperties} verified</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100 bg-orange-50">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.pendingKYC}</h3>
            <p className="text-sm text-gray-500 mt-1">KYC Requests</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <FileCheck className="w-8 h-8 text-purple-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.activeListings}</h3>
            <p className="text-sm text-gray-500 mt-1">Active Listings</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pending KYC Verifications</h3>
            
            <div className="space-y-4">
              {pendingKYC.map((user) => (
                <div key={user.id} className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                          <p className="text-sm font-mono text-gray-900">{user.wallet}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                          <p className="text-sm text-gray-900">{user.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-600">Documents:</span>
                        {user.documents.map((doc, index) => (
                          <span key={index} className="px-2 py-1 bg-white border border-orange-300 rounded text-xs">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Documents
                      </button>
                      <button
                        onClick={() => handleApproveKYC(user.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectKYC(user.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;