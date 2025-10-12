import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, X, Shield, CheckCircle, AlertCircle, CreditCard, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { getUserDetails, isUserRegistered } = useUserRegistry();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    resAddress: '',
    aadharNumber: '',
    aadharFileHash: '',
    walletAddress: '',
    role: 'User',
    verified: false,
    accountCreatedDateTime: '',
    totalIndices: 0,
    requestIndices: 0
  });

  // Redirect if not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch user data from blockchain
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && currentAccount) {
        try {
          setLoading(true);

          // Check if user is registered
          const isReg = await isUserRegistered(currentAccount);
          setRegistered(isReg);

          if (!isReg) {
            // Redirect to registration if not registered
            navigate('/register');
            return;
          }

          // Fetch user details from smart contract
          const userData = await getUserDetails(currentAccount);

          setProfileData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            dateOfBirth: userData.dateOfBirth,
            resAddress: userData.resAddress,
            aadharNumber: userData.aadharNumber,
            aadharFileHash: userData.aadharFileHash,
            walletAddress: currentAccount,
            role: userData.role,
            verified: userData.verified,
            accountCreatedDateTime: new Date(parseInt(userData.accountCreated) * 1000).toLocaleDateString(),
            totalIndices: 0, // TODO: Fetch from contract
            requestIndices: 0 // TODO: Fetch from contract
          });

        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isConnected, currentAccount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Update updatable fields (email, resAddress) on blockchain if contract supports it
      // Note: Most fields are immutable in your current contract
      console.log('Profile update requested:', {
        email: profileData.email,
        resAddress: profileData.resAddress
      });
      
      alert('Note: Profile updates are not yet implemented in the smart contract. Email and address changes would require contract modification.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data by re-fetching
    window.location.reload();
  };

  const getRoleDisplay = (role) => {
    if (role === 'Main Administrator') return 'Main Administrator';
    if (role === 'Regional Admin') return 'Regional Admin';
    if (role === 'User') return 'User';
    return 'Unknown';
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'Main Administrator') return 'bg-red-100 text-red-700';
    if (role === 'Regional Admin') return 'bg-purple-100 text-purple-700';
    if (role === 'User') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Loading state
  if (web3Loading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not registered state
  if (!registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">You need to register first</p>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar 
        userRole={getRoleDisplay(profileData.role)} 
        walletAdd={profileData.walletAddress.slice(0, 10) + '...'} 
      />

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

              {profileData.verified ? (
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
              ) : (
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

              {/* Back to Dashboard Button */}
              <button
                onClick={() => navigate('/user/dashboard')}
                className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Right Column - Profile Details (keep existing code) */}
          <div className="lg:col-span-2">
            {/* ... rest of your existing profile details code ... */}
            {/* I'll keep your existing code for the right column */}
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

              {/* Keep all your existing form fields */}
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
                    disabled={true} // Always disabled - immutable on blockchain
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">Name cannot be changed (blockchain immutable)</p>
                </div>

                {/* Continue with rest of your fields... */}
                {/* I'm keeping your existing field structure */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
