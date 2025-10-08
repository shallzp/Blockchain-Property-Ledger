import React, { useState } from 'react';
import { Home, Users, Shield, FileText, Eye, CheckCircle, XCircle, Pause, Play, Search, Filter, Download, Bell, Plus, History, MapPin } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('admins');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Mock data - Replace with actual contract data
  const stats = {
    totalUsers: 1247,
    totalProperties: 856,
    localAdmins: 24,
    pendingAdmins: 3,
    totalTransactions: 342,
    activeAdmins: 21
  };

  const pendingAdmins = [
    { id: 1, name: 'Rajesh Kumar', wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0A13f', region: 'Mumbai', requestDate: '2024-10-05', email: 'rajesh@mumbai.gov.in' },
    { id: 2, name: 'Priya Sharma', wallet: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', region: 'Delhi', requestDate: '2024-10-06', email: 'priya@delhi.gov.in' },
    { id: 3, name: 'Amit Patel', wallet: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', region: 'Bangalore', requestDate: '2024-10-07', email: 'amit@bangalore.gov.in' }
  ];

  const localAdmins = [
    { id: 1, name: 'Suresh Menon', wallet: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', region: 'Chennai', status: 'active', verified: 145, joined: '2024-08-15' },
    { id: 2, name: 'Kavita Singh', wallet: '0x6B175474E89094C44Da98b954EedeAC495271d0F', region: 'Pune', status: 'active', verified: 98, joined: '2024-08-20' },
    { id: 3, name: 'Rahul Verma', wallet: '0xdAC17F958D2ee523a2206206994597C13D831ec7', region: 'Hyderabad', status: 'suspended', verified: 67, joined: '2024-09-01' },
    { id: 4, name: 'Meera Iyer', wallet: '0x514910771AF9Ca656af840dff83E8264EcF986CA', region: 'Kolkata', status: 'active', verified: 112, joined: '2024-08-25' }
  ];

  const transactions = [
    { id: 1, txHash: '0x8f5a...3c9d', type: 'Transfer', property: 'Villa Golden Springs #4521', from: 'John Doe (0x742d...A13f)', to: 'Jane Smith (0x8f3C...6A063)', value: '12.5 ETH', status: 'completed', date: '2024-10-08 14:30', admin: 'Suresh Menon' },
    { id: 2, txHash: '0x3d2a...7f1e', type: 'Transfer', property: 'Plot Sector 45 #892', from: 'Amit Kumar (0x1c7D...7238)', to: 'Priya Sharma (0x95aD...C4cE)', value: '8.2 ETH', status: 'pending', date: '2024-10-08 10:15', admin: 'Kavita Singh' },
    { id: 3, txHash: '0x1a8b...4d2c', type: 'Registration', property: 'House Lake View #3341', from: 'Rajesh Patel (0x6B17...1d0F)', to: '-', value: '-', status: 'completed', date: '2024-10-07 16:45', admin: 'Suresh Menon' },
    { id: 4, txHash: '0x9c4e...8b3a', type: 'Transfer', property: 'Apartment Tower B #1523', from: 'Sarah Lee (0xdAC1...1ec7)', to: 'Michael Brown (0x5149...6CA)', value: '15.8 ETH', status: 'completed', date: '2024-10-07 11:20', admin: 'Meera Iyer' },
    { id: 5, txHash: '0x7b2f...6e9c', type: 'Verification', property: 'Downtown Plot #6782', from: 'Admin Review', to: 'Verified', value: '-', status: 'completed', date: '2024-10-06 09:30', admin: 'Kavita Singh' }
  ];

  const allProperties = [
    { id: 1, propertyId: '#4521', title: 'Golden Springfield Villa', owner: 'John Doe', ownerWallet: '0x742d...A13f', location: 'Beverly Hills, Mumbai', area: '6x78.5 m²', price: '12.5 ETH', status: 'verified', forSale: false, registered: '2024-06-15' },
    { id: 2, propertyId: '#892', title: 'Lake View Mansion', owner: 'Jane Smith', ownerWallet: '0x8f3C...6A063', location: 'Lake Sevilla, Bangalore', area: '8x95 m²', price: '18.2 ETH', status: 'verified', forSale: true, registered: '2024-07-20' },
    { id: 3, propertyId: '#3341', title: 'Downtown Apartment', owner: 'Amit Kumar', ownerWallet: '0x1c7D...7238', location: 'Downtown, Delhi', area: '4x60 m²', price: '6.5 ETH', status: 'pending', forSale: true, registered: '2024-10-05' },
    { id: 4, propertyId: '#1523', title: 'Coastal Villa', owner: 'Priya Sharma', ownerWallet: '0x95aD...C4cE', location: 'Coastal Road, Chennai', area: '7x85 m²', price: '14.3 ETH', status: 'verified', forSale: false, registered: '2024-08-10' }
  ];

  const allUsers = [
    { id: 1, name: 'John Doe', wallet: '0x742d...A13f', role: 'Citizen', properties: 3, status: 'verified', joined: '2024-06-15', transactions: 12 },
    { id: 2, name: 'Jane Smith', wallet: '0x8f3C...6A063', role: 'Citizen', properties: 2, status: 'verified', joined: '2024-07-20', transactions: 8 },
    { id: 3, name: 'Amit Kumar', wallet: '0x1c7D...7238', role: 'Citizen', properties: 1, status: 'verified', joined: '2024-08-10', transactions: 5 },
    { id: 4, name: 'Priya Sharma', wallet: '0x95aD...C4cE', role: 'Citizen', properties: 2, status: 'verified', joined: '2024-08-15', transactions: 7 },
    { id: 5, name: 'Rajesh Patel', wallet: '0x6B17...1d0F', role: 'Citizen', properties: 0, status: 'pending', joined: '2024-10-05', transactions: 0 }
  ];

  const handleApproveAdmin = (adminId) => {
    console.log('Approving admin:', adminId);
    // TODO: Call contract function verifyLocalAdmin(address)
  };

  const handleRejectAdmin = (adminId) => {
    console.log('Rejecting admin:', adminId);
    // TODO: Call contract function rejectUser(address)
  };

  const handleSuspendAdmin = (adminId) => {
    console.log('Suspending admin:', adminId);
    // TODO: Call contract function to suspend admin
  };

  const handleActivateAdmin = (adminId) => {
    console.log('Activating admin:', adminId);
    // TODO: Call contract function to activate admin
  };

  const AddAdminModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Local Admin</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Name</label>
            <input type="text" placeholder="Enter admin name" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
            <input type="text" placeholder="0x..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
            <input type="text" placeholder="Enter region/city" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowAddAdminModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
            <button className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">
              Add Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {showAddAdminModal && <AddAdminModal />}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Control Panel</h1>
                <p className="text-sm text-gray-500">System-wide oversight and management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Citizens</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <Home className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalProperties}</h3>
            <p className="text-sm text-gray-500 mt-1">Properties</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <Shield className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{stats.localAdmins}</h3>
            <p className="text-sm text-gray-500 mt-1">Local Admins</p>
          </div>

          <div className="rounded-xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition bg-orange-50">
            <FileText className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{stats.pendingAdmins}</h3>
            <p className="text-sm text-gray-500 mt-1">Pending Approvals</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <History className="w-8 h-8 text-cyan-500 mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</h3>
            <p className="text-sm text-gray-500 mt-1">Transactions</p>
          </div>

          <div className="rounded-xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition bg-green-50">
            <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{stats.activeAdmins}</h3>
            <p className="text-sm text-gray-500 mt-1">Active Admins</p>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'admins'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5 inline mr-2" />
              Local Admin Management
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'audit'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5 inline mr-2" />
              Audit & Monitoring
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'properties'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Property Oversight
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'users'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              User Management
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Local Admin Management Tab */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                {/* Pending Admin Approvals */}
                {pendingAdmins.length > 0 && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-orange-500" />
                        Pending Admin Approvals ({pendingAdmins.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {pendingAdmins.map((admin) => (
                        <div key={admin.id} className="bg-white rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-gray-900">{admin.name}</h4>
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                  {admin.region}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 font-mono mb-1">{admin.wallet}</p>
                              <p className="text-sm text-gray-500">{admin.email}</p>
                              <p className="text-xs text-gray-400 mt-2">Requested: {admin.requestDate}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRejectAdmin(admin.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                              <button
                                onClick={() => handleApproveAdmin(admin.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Local Admins */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">All Local Admins</h3>
                    <button
                      onClick={() => setShowAddAdminModal(true)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Admin Manually
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Admin</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Wallet Address</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Region</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Verified</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {localAdmins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-gray-900">{admin.name}</div>
                            </td>
                            <td className="px-4 py-4">
                              <code className="text-sm text-gray-600">{admin.wallet}</code>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-900">{admin.region}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-semibold text-gray-900">{admin.verified} users</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-600">{admin.joined}</span>
                            </td>
                            <td className="px-4 py-4">
                              {admin.status === 'active' ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                  <Play className="w-3 h-3" />
                                  Active
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                  <Pause className="w-3 h-3" />
                                  Suspended
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {admin.status === 'active' ? (
                                <button
                                  onClick={() => handleSuspendAdmin(admin.id)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition flex items-center gap-1"
                                >
                                  <Pause className="w-3 h-3" />
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivateAdmin(admin.id)}
                                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition flex items-center gap-1"
                                >
                                  <Play className="w-3 h-3" />
                                  Activate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Audit & Monitoring Tab */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Transaction History & Audit Trail</h3>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tx Hash</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">From</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">To</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date/Time</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Verified By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <code className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">{tx.txHash}</code>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.type === 'Transfer' ? 'bg-blue-100 text-blue-700' :
                              tx.type === 'Registration' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">{tx.property}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-600">{tx.from}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-600">{tx.to}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-semibold text-gray-900">{tx.value}</div>
                          </td>
                          <td className="px-4 py-4">
                            {tx.status === 'completed' ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                <History className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-600">{tx.date}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{tx.admin}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Complete Audit Trail</h4>
                      <p className="text-sm text-blue-800">
                        All transactions are recorded on-chain with immutable timestamps. Each property transfer includes verification from local admins, 
                        ensuring transparency and accountability. Click on any transaction hash to view full blockchain details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Oversight Tab */}
            {activeTab === 'properties' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">All Registered Properties</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                      />
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {allProperties.map((property) => (
                    <div key={property.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-bold">{property.propertyId}</span>
                            <h4 className="text-xl font-bold text-gray-900">{property.title}</h4>
                            {property.status === 'verified' ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                Pending Verification
                              </span>
                            )}
                            {property.forSale && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                For Sale
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Owner</p>
                              <p className="text-sm font-semibold text-gray-900">{property.owner}</p>
                              <p className="text-xs text-gray-600 font-mono">{property.ownerWallet}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Location</p>
                              <p className="text-sm text-gray-900 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {property.location}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Area</p>
                              <p className="text-sm font-semibold text-gray-900">{property.area}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Price</p>
                              <p className="text-sm font-semibold text-orange-600">{property.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Registered: {property.registered}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-6">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2">
                            <History className="w-4 h-4" />
                            View History
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Showing {allProperties.length} of {stats.totalProperties} properties</p>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    Load More →
                  </button>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">All Registered Citizens</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                      />
                    </div>
                    <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm">
                      <option>All Status</option>
                      <option>Verified</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Wallet Address</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Properties</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transactions</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0)}
                              </div>
                              <div className="font-semibold text-gray-900">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <code className="text-sm text-gray-600">{user.wallet}</code>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-semibold text-gray-900">{user.properties}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-600">{user.transactions}</span>
                          </td>
                          <td className="px-4 py-4">
                            {user.status === 'verified' ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium w-fit">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-600">{user.joined}</span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Showing {allUsers.length} of {stats.totalUsers} users</p>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    Load More →
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Citizen Role Explanation</h4>
                      <p className="text-sm text-blue-800">
                        All registered users are Citizens who can both buy and sell properties. They can register their properties, 
                        list them for sale, make purchase requests, and complete transactions. Each citizen requires KYC verification 
                        from a Local Admin before accessing the full platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;