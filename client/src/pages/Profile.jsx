import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765-43210',
    address: '123 Main Street, Andheri West, Mumbai - 400053',
    aadhaar: 'XXXX-XXXX-4521',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0A13f',
    verificationStatus: 'verified',
    joinedDate: '2024-06-15',
    totalProperties: 24,
    totalTransactions: 42,
    verifiedBy: 'Mumbai Local Admin'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Call contract function to update profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Citizen" walletAdd={profileData.walletAddress.slice(0, 10) + '...'} />

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and verification status</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                  {profileData.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                {profileData.verificationStatus === 'verified' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Citizen</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Pending Verification</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Properties Owned</span>
                  <span className="text-lg font-bold text-gray-900">{profileData.totalProperties}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Transactions</span>
                  <span className="text-lg font-bold text-gray-900">{profileData.totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">{profileData.joinedDate}</span>
                </div>
              </div>

              {profileData.verificationStatus === 'verified' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 mb-1">Verified By</p>
                      <p className="text-xs text-green-700">{profileData.verifiedBy}</p>
                      <p className="text-xs text-green-600 mt-1">Your KYC is approved and you can access all features.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      isEditing 
                        ? 'border-gray-200 focus:border-orange-500 bg-white' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      isEditing 
                        ? 'border-gray-200 focus:border-orange-500 bg-white' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      isEditing 
                        ? 'border-gray-200 focus:border-orange-500 bg-white' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      isEditing 
                        ? 'border-gray-200 focus:border-orange-500 bg-white' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Aadhaar (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={profileData.aadhaar}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">Aadhaar cannot be changed for security reasons</p>
                </div>

                {/* Wallet Address (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={profileData.walletAddress}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">Your blockchain wallet address is permanent</p>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Property Transfer Completed</p>
                    <p className="text-sm text-gray-600">Villa Golden Springs #4521 transferred successfully</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Purchase Request Sent</p>
                    <p className="text-sm text-gray-600">Request sent for Lake View Plot #892</p>
                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Property Listed for Sale</p>
                    <p className="text-sm text-gray-600">Downtown Apartment #3341 marked for sale</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;