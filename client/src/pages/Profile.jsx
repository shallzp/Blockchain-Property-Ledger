import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, X, Shield, CheckCircle, AlertCircle, CreditCard, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = ({ walletAddress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    dateOfBirth: '1990-05-15',
    resAddress: '123 Main Street, Andheri West, Mumbai - 400053',
    aadharNumber: '123456784521',
    aadharFileHash: 'QmX4a9Zj3kL8mN2pQ5rS7tU9vW1xY3zA6bC8dE0fG2hI4',
    walletAddress: walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0A13f',
    role: 'User', // User, RegionalAdmin, or MainAdministrator
    verified: true, // true or false
    accountCreatedDateTime: '2024-06-15',
    totalIndices: 24, // Total properties owned
    requestIndices: 8 // Total requests made
  });

  const [loading, setLoading] = useState(false);

  // TODO: Fetch user data from blockchain on component mount
  useEffect(() => {
    fetchUserData();
  }, [walletAddress]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      /* TODO: Replace with actual contract call
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const userData = await contract.getUserDetails(walletAddress);
      
      setProfileData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
        resAddress: userData.resAddress,
        aadharNumber: userData.aadharNumber,
        aadharFileHash: userData.aadharFileHash,
        walletAddress: walletAddress,
        role: userData.role,
        verified: userData.verified,
        accountCreatedDateTime: new Date(userData.accountCreated * 1000).toLocaleDateString(),
        totalIndices: parseInt(userData.totalIndices),
        requestIndices: parseInt(userData.requestIndices)
      });
      */
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Update updatable fields (email, resAddress) on blockchain if needed
      // Note: Most fields are immutable in the contract
      console.log('Saving profile:', profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchUserData(); // Reset to original data
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'MainAdministrator': return 'Main Administrator';
      case 'RegionalAdmin': return 'Regional Admin';
      case 'User': return 'Citizen';
      default: return 'Unknown';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'MainAdministrator': return 'bg-red-100 text-red-700';
      case 'RegionalAdmin': return 'bg-purple-100 text-purple-700';
      case 'User': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole={getRoleDisplay(profileData.role)} walletAdd={profileData.walletAddress.slice(0, 10) + '...'} />

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
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                
                {/* Role Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${getRoleBadgeColor(profileData.role)}`}>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">{getRoleDisplay(profileData.role)}</span>
                </div>

                {/* Verification Status */}
                {profileData.verified ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified</span>
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
                  <span className="text-lg font-bold text-gray-900">{profileData.totalIndices}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Purchase Requests</span>
                  <span className="text-lg font-bold text-gray-900">{profileData.requestIndices}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">{profileData.accountCreatedDateTime}</span>
                </div>
              </div>

              {profileData.verified && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 mb-1">Account Verified</p>
                      <p className="text-xs text-green-700">Your KYC is approved by a Regional Admin.</p>
                      <p className="text-xs text-green-600 mt-1">You can now access all platform features.</p>
                    </div>
                  </div>
                </div>
              )}

              {!profileData.verified && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900 mb-1">Verification Pending</p>
                      <p className="text-xs text-orange-700">A Regional Admin needs to verify your documents.</p>
                      <p className="text-xs text-orange-600 mt-1">Limited access until verified.</p>
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
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      isEditing 
                        ? 'border-gray-200 focus:border-orange-500 bg-white' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      isEditing 
                        ? 'border-gray-200 focus:border-orange-500 bg-white' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Date of Birth (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={profileData.dateOfBirth}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">Date of birth cannot be changed</p>
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

                {/* Residential Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Residential Address
                  </label>
                  <textarea
                    name="resAddress"
                    value={profileData.resAddress}
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

                {/* Aadhaar Number (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={profileData.aadharNumber}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">Aadhaar cannot be changed for security reasons</p>
                </div>

                {/* Aadhaar File Hash (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Aadhaar Document (IPFS Hash)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profileData.aadharFileHash}
                      disabled
                      className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed font-mono text-sm"
                    />
                    <a
                      href={`https://ipfs.io/ipfs/${profileData.aadharFileHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
                    >
                      View on IPFS
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your Aadhaar document is stored securely on IPFS</p>
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

            {/* Blockchain Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Blockchain Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs text-blue-600 font-semibold mb-2">Account Role</p>
                  <p className="text-lg font-bold text-blue-900">{getRoleDisplay(profileData.role)}</p>
                  <p className="text-xs text-blue-700 mt-2">
                    {profileData.role === 'User' && 'Citizen with full buy/sell capabilities'}
                    {profileData.role === 'RegionalAdmin' && 'Can verify users and properties'}
                    {profileData.role === 'MainAdministrator' && 'System administrator with full control'}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs text-green-600 font-semibold mb-2">Verification Status</p>
                  <p className="text-lg font-bold text-green-900">
                    {profileData.verified ? 'Verified' : 'Pending'}
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    {profileData.verified 
                      ? 'Your account is fully verified and active' 
                      : 'Awaiting Regional Admin verification'}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-semibold mb-2">Total Properties</p>
                  <p className="text-lg font-bold text-purple-900">{profileData.totalIndices}</p>
                  <p className="text-xs text-purple-700 mt-2">Properties registered on blockchain</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-xs text-orange-600 font-semibold mb-2">Purchase Requests</p>
                  <p className="text-lg font-bold text-orange-900">{profileData.requestIndices}</p>
                  <p className="text-xs text-orange-700 mt-2">Total buy requests made</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Account Verified</p>
                    <p className="text-sm text-gray-600">Your KYC was approved by Regional Admin</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Property Registered</p>
                    <p className="text-sm text-gray-600">Villa Golden Springs #4521 added to blockchain</p>
                    <p className="text-xs text-gray-400 mt-1">5 days ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Account Created</p>
                    <p className="text-sm text-gray-600">Successfully registered on LandChain</p>
                    <p className="text-xs text-gray-400 mt-1">{profileData.accountCreatedDateTime}</p>
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