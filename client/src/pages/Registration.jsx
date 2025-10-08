import { useState } from 'react';
import { Home, User, Mail, CreditCard, Shield, Loader, CheckCircle, XCircle, AlertCircle, Upload, MapPinHouse, CalendarDays } from 'lucide-react';

import RoleSelection from '../components/RoleSelection';
import FormInput from '../components/FormInput';

const Registration = ( props ) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    aadhaar: "",
    age: "",
    city: "",
    aadhaarFile: null,
    role: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.age.trim() || isNaN(formData.age)) {
      setError("Valid age is required");
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.aadhaar.trim() || formData.aadhaar.length < 12) {
      setError('Valid Aadhaar number (12 digits) is required');
      return false;
    }
    if (!formData.aadhaarFile){
      setError("Aadhaar PDF upload is required");
      return false;
    }
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    return true;
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

      console.log('Registering user with data:', {
        ...formData,
        walletAddress: props.walletAddress
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      
      setTimeout(() => {
        if (props.onRegistrationComplete) {
          props.onRegistrationComplete({
            role: formData.role,
            name: formData.name,
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
            Your registration has been submitted successfully.
          </p>
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-orange-800 mb-2">Pending Verification</p>
                <p className="text-sm text-orange-700">
                  {formData.role === '2' 
                    ? 'Your Local Admin registration requires Super Admin approval.'
                    : 'Your registration requires Local Admin verification.'
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
          <RoleSelection selectedRole={formData.role} onRoleSelect={handleRoleSelect}> </RoleSelection>

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

              <FormInput label="Full Name" Icon={User} type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter you full name" required={true}></FormInput>
           
              <FormInput label="Age" Icon={CalendarDays} type="text" name="age" value={formData.age} onChange={handleInputChange} placeholder="Enter your age" required={true}></FormInput>
              
              <FormInput label="City" Icon={MapPinHouse} type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter the city you live in" required={true}></FormInput>

              <FormInput label="Email Address" Icon={Mail} type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" required={true}></FormInput>

              <FormInput label="Aadhaar Number" Icon={CreditCard} type="text" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} placeholder="XXXX XXXX XXXX" required={true}></FormInput>

              <FormInput label="Add Your Aadhar Card (PDF Format)" Icon={Upload} type="file" name="aadharf" value={formData.aadharf} onChange={handleInputChange} accept=".pdf" required={true}></FormInput>

              <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Verification Process</p>
                    <p className="text-blue-700">
                      After registration, your account will be pending verification. 
                      {formData.role === '2' 
                        ? ' Super Admin will review your Local Admin request.'
                        : ' A Local Admin will verify your KYC documents.'
                      }
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