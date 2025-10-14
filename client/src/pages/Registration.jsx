import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Mail, CreditCard, Loader, CheckCircle, XCircle, AlertCircle, Upload, MapPinHouse, CalendarDays } from 'lucide-react';

import FormInput from '../components/FormInput';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';
// import { uploadToIPFSSecure } from '../utils/secureIpfsUpload'; // If you implemented secure IPFS

const Registration = () => {
  const navigate = useNavigate();
  const { currentAccount, isConnected } = useWeb3();
  const { registerUser, loading: contractLoading } = useUserRegistry();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    aadharNumber: "",
    resAddress: "",
    // aadharFile: null, // commented out as no upload for now
    // aadharFileHash: "" // commented out as no upload for now
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0); // commented out upload progress
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value /*, files*/ } = e.target;
    setFormData(prev => ({
      ...prev,
      // [name]: files ? files[0] : value,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.dateOfBirth.trim()) {
      setError('Date of birth is required');
      return false;
    }
    if (!formData.resAddress.trim()) {
      setError('Residential address is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.aadharNumber.trim() || formData.aadharNumber.length !== 12) {
      setError('Valid Aadhaar number (12 digits) is required');
      return false;
    }
    // Upload validation removed for now
    // if (!formData.aadharFile) {
    //   setError("Aadhaar PDF upload is required");
    //   return false;
    // }
    return true;
  };

  // Upload function commented out for now
  /*
  const uploadToIPFS = async (file) => {
    console.log('Uploading file to IPFS:', file.name);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isConnected || !currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError('');
    // setUploadProgress(0); // commented out

    try {
      // Upload step omitted for now
      /*
      console.log('Uploading Aadhaar to IPFS...');
      setUploadProgress(25);

      const ipfsHash = await uploadToIPFS(formData.aadharFile);
      console.log('IPFS Hash:', ipfsHash);
      setUploadProgress(50);
      */

      console.log('Registering user on blockchain...');

      const tx = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        aadharNumber: formData.aadharNumber,
        resAddress: formData.resAddress,
        email: formData.email,
        aadharFileHash: ""// Provide empty string for now
      });

      // setUploadProgress(100); // commented out
      console.log('Transaction:', tx);

      console.log('User registered with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        aadharNumber: formData.aadharNumber,
        resAddress: formData.resAddress,
        email: formData.email,
        // aadharFileHash: ipfsHash, // commented out
        walletAddress: currentAccount,
        role: 'User', // Always registered as User
        verified: false // Requires Regional Admin verification
      });

      setSuccess(true);

      // Redirect to pending verification page
      setTimeout(() => {
        navigate('/pending-verification');
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      // setUploadProgress(0); // commented out
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your registration has been submitted to the blockchain successfully.
          </p>
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-orange-800 mb-2">Pending Verification</p>
                <p className="text-sm text-orange-700">
                  Your account requires verification from a Regional Admin before you can access all features.
                </p>
                <p className="text-sm text-orange-600 mt-2">
                  You will receive access once verified. This usually takes 24-48 hours.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Main registration form UI below (unchanged except for aadharFile input commented out above)
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-gray-800">PropChain</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PropChain</h1>
              <p className="text-gray-600">Complete your registration to get started</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Connected Wallet</p>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-sm">
                  {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : 'Not Connected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Info Box */}
            <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-2">Citizen Registration</p>
                  <p className="text-sm text-blue-700 mb-2">
                    You are registering as a <strong>Citizen (User)</strong> on the PropChain platform.
                  </p>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>✓ Register and manage your properties</p>
                    <p>✓ List properties for sale on the marketplace</p>
                    <p>✓ Browse and purchase properties</p>
                    <p>✓ Send and receive purchase requests</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-3">
                    <strong>Note:</strong> Your account will require verification from a Regional Admin before you can access all features.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Registration Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput 
                label="First Name" 
                Icon={User} 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                placeholder="Enter your first name" 
                required={true}
              />
            
              <FormInput 
                label="Last Name" 
                Icon={User} 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                placeholder="Enter your last name" 
                required={true}
              />
            </div>

            <FormInput 
              label="Date of Birth" 
              Icon={CalendarDays} 
              type="date" 
              name="dateOfBirth" 
              value={formData.dateOfBirth} 
              onChange={handleInputChange} 
              required={true}
            />

            <FormInput 
              label="Email Address" 
              Icon={Mail} 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="your.email@example.com" 
              required={true}
            />

            <FormInput 
              label="Residential Address" 
              Icon={MapPinHouse} 
              type="text" 
              name="resAddress" 
              value={formData.resAddress} 
              onChange={handleInputChange} 
              placeholder="Enter your complete residential address" 
              required={true}
            />

            <FormInput 
              label="Aadhaar Number" 
              Icon={CreditCard} 
              type="text" 
              name="aadharNumber" 
              value={formData.aadharNumber} 
              onChange={handleInputChange} 
              placeholder="123456789012 (12 digits)" 
              maxLength="12"
              required={true}
            />

            {/* Upload input removed for now */}
            {/* <FormInput 
              label="Upload Aadhaar Card (PDF Format)" 
              Icon={Upload} 
              type="file" 
              name="aadharFile" 
              onChange={handleInputChange} 
              accept=".pdf" 
              required={true}
            /> */}

            {/* <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Privacy & Security</p>
                  <p className="text-gray-600">
                    Your Aadhaar document will be uploaded to IPFS (decentralized storage) and only the hash will be stored on the blockchain. 
                    Only authorized Regional Admins can verify your documents securely.
                  </p>
                </div>
              </div>
            </div> */}

            <button
              type="submit"
              disabled={isSubmitting || contractLoading || !isConnected}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isSubmitting || contractLoading || !isConnected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
              }`}
            >
              {isSubmitting || contractLoading ? (
                <div>
                  <span className="flex items-center justify-center gap-2 mb-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    {'Registering on Blockchain...'}
                  </span>
                </div>
              ) : !isConnected ? (
                'Please Connect Wallet'
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
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
                <p className="text-sm text-gray-600">Your details are permanently recorded on the blockchain as a User (Citizen)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">KYC Verification</p>
                <p className="text-sm text-gray-600">A Regional Admin will verify your Aadhaar documents (usually takes 24-48 hours)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Account Activated</p>
                <p className="text-sm text-gray-600">Once verified, you can register properties, list them for sale, and purchase other properties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Note */}
        <div className="mt-6 bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-purple-900 mb-1">Want to become a Regional Admin?</p>
              <p className="text-purple-700">
                Regional Admin roles are assigned by the Main Administrator. After successful registration and verification, 
                you can contact the system administrator to request Regional Admin privileges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;