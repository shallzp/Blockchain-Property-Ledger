import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Maximize, FileText, Loader, CheckCircle, XCircle, AlertCircle, Upload, Building, Hash } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';
import { useUserRegistry } from '../hooks/useUserRegistry';

const AddProperty = () => {
  const navigate = useNavigate();
  const navItems = useNavItems(); 
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { addLand, loading: contractLoading } = usePropertyRegistry();
  const { getUserDetails, isUserVerified } = useUserRegistry();

  const [formData, setFormData] = useState({
    locationId: '',
    revenueDepartmentId: '',
    surveyNumber: '',
    area: '',
    propertyType: 'Residential',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);

  // Property types
  const propertyTypes = [
    { value: 'Residential', label: 'Residential Land', icon: Home },
    { value: 'Commercial', label: 'Commercial Plot', icon: Building },
    { value: 'Agricultural', label: 'Agricultural Land', icon: Maximize },
    { value: 'Industrial', label: 'Industrial Plot', icon: Building }
  ];

  // Redirect if not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Check if user is verified
  useEffect(() => {
    const checkVerification = async () => {
      if (isConnected && currentAccount) {
        try {
          setCheckingVerification(true);
          const verified = await isUserVerified(currentAccount);
          setUserVerified(verified);

          if (!verified) {
            setError('Your account must be verified by a Regional Admin before you can register properties.');
          }
        } catch (error) {
          console.error('Error checking verification:', error);
          setError('Failed to check verification status');
        } finally {
          setCheckingVerification(false);
        }
      }
    };

    checkVerification();
  }, [isConnected, currentAccount]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.locationId.trim()) {
      setError('Location ID is required');
      return false;
    }
    if (!formData.revenueDepartmentId.trim()) {
      setError('Revenue Department ID is required');
      return false;
    }
    if (!formData.surveyNumber.trim()) {
      setError('Survey Number is required');
      return false;
    }
    if (!formData.area.trim() || parseFloat(formData.area) <= 0) {
      setError('Valid area is required');
      return false;
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!userVerified) {
      setError('Your account must be verified before registering properties');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Call smart contract to add land
      const tx = await addLand({
        locationId: parseInt(formData.locationId),
        revenueDepartmentId: parseInt(formData.revenueDepartmentId),
        surveyNumber: parseInt(formData.surveyNumber),
        area: parseInt(formData.area)
      });

      console.log('Property registered:', tx);

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate('/properties');
      }, 3000);

    } catch (err) {
      console.error('Error registering property:', err);
      setError(err.message || 'Failed to register property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (web3Loading || checkingVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="User" walletAdd={currentAccount} navItems={navItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="Citizen" walletAdd={currentAccount} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Property Registered Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your property has been submitted to the blockchain and is awaiting verification from the Revenue Department.
            </p>
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="font-semibold text-orange-800 mb-2">Pending Verification</p>
                  <p className="text-sm text-orange-700">
                    The Revenue Department Employee will verify your property details. Once verified, you can list it for sale.
                  </p>
                  <p className="text-sm text-orange-600 mt-2">
                    You will be notified when your property is verified.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Redirecting to properties...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Citizen" walletAdd={currentAccount} />

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/properties')}
            className="text-orange-600 hover:text-orange-700 mb-4 flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Properties
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register New Property</h1>
          <p className="text-gray-600">Add your property to the blockchain registry</p>
        </div>

        {/* Not Verified Warning */}
        {!userVerified && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-2">Account Not Verified</p>
                <p className="text-sm text-red-700">
                  Your account must be verified by a Regional Admin before you can register properties. 
                  Please wait for verification or contact support.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                >
                  View Profile Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Registration Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Property Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Property Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                    className={`p-4 rounded-xl border-2 transition ${
                      formData.propertyType === type.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      formData.propertyType === type.value ? 'text-orange-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      formData.propertyType === type.value ? 'text-orange-900' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Location ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-orange-500" />
                Location ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
                placeholder="e.g. 101"
                disabled={!userVerified}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  userVerified 
                    ? 'border-gray-200 focus:border-orange-500 bg-white' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Geographic location identifier</p>
            </div>

            {/* Revenue Department ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2 text-orange-500" />
                Revenue Department ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="revenueDepartmentId"
                value={formData.revenueDepartmentId}
                onChange={handleInputChange}
                placeholder="e.g. 501"
                disabled={!userVerified}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  userVerified 
                    ? 'border-gray-200 focus:border-orange-500 bg-white' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Local revenue department identifier</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Survey Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2 text-orange-500" />
                Survey Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="surveyNumber"
                value={formData.surveyNumber}
                onChange={handleInputChange}
                placeholder="e.g. 12345"
                disabled={!userVerified}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  userVerified 
                    ? 'border-gray-200 focus:border-orange-500 bg-white' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Official government survey number</p>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Maximize className="w-4 h-4 inline mr-2 text-orange-500" />
                Area (Square Feet) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g. 1000"
                disabled={!userVerified}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                  userVerified 
                    ? 'border-gray-200 focus:border-orange-500 bg-white' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Total area in square feet</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2 text-orange-500" />
              Property Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide additional details about the property..."
              rows={4}
              disabled={!userVerified}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                userVerified 
                  ? 'border-gray-200 focus:border-orange-500 bg-white' 
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">This information is for your reference only (not stored on blockchain)</p>
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Blockchain Registration</p>
                <p className="text-xs text-blue-700">
                  Your property will be permanently registered on the blockchain. After submission, a Revenue Department Employee will verify the details. Once verified, you can list the property for sale.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !userVerified || contractLoading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isSubmitting || !userVerified || contractLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
            }`}
          >
            {isSubmitting || contractLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Registering on Blockchain...
              </span>
            ) : !userVerified ? (
              'Account Verification Required'
            ) : (
              'Register Property on Blockchain'
            )}
          </button>
        </form>

        {/* What Happens Next */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Blockchain Registration</p>
                <p className="text-sm text-gray-600">Your property details are permanently recorded on the blockchain</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Revenue Department Verification</p>
                <p className="text-sm text-gray-600">Officials verify your property documents and survey details</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Property Verified</p>
                <p className="text-sm text-gray-600">Once verified, you can list your property for sale on the marketplace</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;