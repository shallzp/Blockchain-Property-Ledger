import { useState } from 'react';
import { Home, User, Mail, CreditCard, Loader, CheckCircle, XCircle, AlertCircle, Upload, MapPinHouse, CalendarDays, Shield, Users } from 'lucide-react';

import FormInput from '../components/FormInput';

const Registration = ( props ) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    aadharNumber: "",
    resAddress: "",
    aadharFile: null,
    aadharFileHash: "",
    role: "" // "User" or "RegionalAdmin"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const roles = [
    {
      id: 'User',
      value: 'User',
      name: 'User',
      description: 'Register properties, buy and sell land on the blockchain.',
      icon: Users,
      color: 'blue',
      approval: 'Requires Regional Admin verification'
    },
    {
      id: 'RegionalAdmin',
      value: 'RegionalAdmin',
      name: 'Regional Admin',
      description: 'Verify citizens KYC and approve property registrations in your region.',
      icon: Shield,
      color: 'purple',
      approval: 'Requires Main Administrator approval'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setError("");
  };

  const handleRoleSelect = (roleValue) => {
    setFormData(prev => ({
      ...prev,
      role: roleValue
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
    if (!formData.aadharFile){
      setError("Aadhaar PDF upload is required");
      return false;
    }
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const uploadToIPFS = async (file) => {
    // TODO: Implement actual IPFS upload
    console.log('Uploading file to IPFS:', file.name);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Step 1: Upload Aadhaar file to IPFS
      console.log('Uploading Aadhaar to IPFS...');
      const ipfsHash = await uploadToIPFS(formData.aadharFile);
      console.log('IPFS Hash:', ipfsHash);

      // Step 2: Call smart contract registerUser function
      console.log('Registering user on blockchain...');
      
      /* TODO: Replace with actual contract call
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      const tx = await contract.registerUser(
        formData.firstName,
        formData.lastName,
        formData.dateOfBirth,
        formData.aadharNumber,
        formData.resAddress,
        formData.email,
        ipfsHash
      );
      
      await tx.wait();
      
      // If Regional Admin, need Main Admin to approve
      // The role will be set to User by default in contract
      // Main Admin will use addRegionalAdmin(address) to promote
      
      console.log('Transaction hash:', tx.hash);
      */

      // Simulate contract call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('User registered with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        aadharNumber: formData.aadharNumber,
        resAddress: formData.resAddress,
        email: formData.email,
        aadharFileHash: ipfsHash,
        walletAddress: props.walletAddress,
        requestedRole: formData.role,
        contractRole: 'User', // Contract always registers as User first
        verified: false
      });

      setSuccess(true);
      
      setTimeout(() => {
        if (props.onRegistrationComplete) {
          props.onRegistrationComplete({
            role: formData.role,
            name: `${formData.firstName} ${formData.lastName}`,
            status: 'pending'
          });
        }
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
                  {formData.role === 'RegionalAdmin' 
                    ? 'Your Regional Admin registration requires Main Administrator approval. You will be notified once approved.'
                    : 'Your account requires verification from a Regional Admin to access all features.'
                  }
                </p>
                <p className="text-sm text-orange-600 mt-2">
                  You will receive access once verified. Please check back later.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-gray-800">LandChain</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LandChain</h1>
              <p className="text-gray-600">Complete your registration to get started</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Connected Wallet</p>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-sm">{props.walletAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Role Selection */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Role</h2>
            <div className="space-y-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = formData.role === role.value;
                
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.value)}
                    className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-orange-500' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isSelected ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {role.approval}
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Role Info Box */}
            {formData.role && (
              <div className={`mt-6 rounded-xl p-4 border ${
                formData.role === 'RegionalAdmin' 
                  ? 'bg-purple-50 border-purple-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    formData.role === 'RegionalAdmin' ? 'text-purple-500' : 'text-blue-500'
                  }`} />
                  <div className={`text-sm ${
                    formData.role === 'RegionalAdmin' ? 'text-purple-800' : 'text-blue-800'
                  }`}>
                    <p className="font-semibold mb-1">
                      {formData.role === 'RegionalAdmin' ? 'Regional Admin Registration' : 'User Registration'}
                    </p>
                    <p className={formData.role === 'RegionalAdmin' ? 'text-purple-700' : 'text-blue-700'}>
                      {formData.role === 'RegionalAdmin' 
                        ? 'After registration, the Main Administrator will review your application. Once approved, you can verify citizens and properties in your region.'
                        : 'After registration, a Regional Admin will verify your KYC documents. Once verified, you can register properties, buy and sell land on the blockchain.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Registration Error</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

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

              <FormInput 
                label="Upload Aadhaar Card (PDF Format)" 
                Icon={Upload} 
                type="file" 
                name="aadharFile" 
                onChange={handleInputChange} 
                accept=".pdf" 
                required={true}
              />

              <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Privacy & Security</p>
                    <p className="text-gray-600">
                      Your Aadhaar document will be uploaded to IPFS (decentralized storage) and only the hash will be stored on the blockchain. 
                      Admins can verify your documents securely.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.role}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  isSubmitting || !formData.role
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Registering on Blockchain...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;