import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';

const PendingVerification = () => {
  const navigate = useNavigate();
  const { currentAccount, disconnectWallet } = useWeb3();
  const { getUserDetails, isUserVerified } = useUserRegistry();

  // Check verification status every 10 seconds
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const verified = await isUserVerified(currentAccount);
        
        if (verified) {
          // User got verified! Redirect to dashboard
          const userDetails = await getUserDetails(currentAccount);
          const role = userDetails.role;

          switch (role) {
            case 'Main Administrator':
              navigate('/main/dashboard');
              break;
            case 'Regional Admin':
              navigate('/admin/dashboard');
              break;
            case 'User':
              navigate('/user/dashboard');
              break;
          }
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    // Check immediately
    checkVerification();

    // Then check every 10 seconds
    const interval = setInterval(checkVerification, 10000);

    return () => clearInterval(interval);
  }, [currentAccount, navigate]);

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        {/* Animated Clock Icon */}
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-12 h-12 text-orange-500" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">Verification Pending</h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Your account registration has been submitted successfully and is awaiting verification.
        </p>

        {/* Status Card */}
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200 mb-8">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900 mb-2">What's Happening?</p>
              <p className="text-sm text-orange-700 mb-3">
                A Regional Admin is reviewing your registration and KYC documents. This usually takes 24-48 hours.
              </p>
              <p className="text-sm text-orange-600">
                You'll be able to access the platform once your account is verified.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Verification Steps</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Registration Submitted</p>
                <p className="text-sm text-gray-600">Your information has been recorded on the blockchain</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">KYC Verification in Progress</p>
                <p className="text-sm text-gray-600">Regional Admin is reviewing your documents</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="font-semibold text-gray-400">Account Activation</p>
                <p className="text-sm text-gray-500">You'll get access to all platform features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-refresh notice */}
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Auto-checking verification status...</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            View Profile
          </button>
          <button
            onClick={handleDisconnect}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
          >
            Disconnect Wallet
          </button>
        </div>

        {/* Contact */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <a 
            href="mailto:support@propchain.com" 
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
