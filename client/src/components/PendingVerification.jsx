import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const PendingVerification = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Verification Pending</h2>
        <p className="text-center text-gray-600 mb-8">
          Your account registration has been submitted successfully and is awaiting verification.
        </p>
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200 mb-8">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900 mb-2">What's Happening?</p>
              <p className="text-sm text-orange-700 mb-3">
                A Regional Admin is reviewing your registration and KYC documents. This usually takes 24-48 hours.
              </p>
              <p className="text-sm text-orange-600">
                Access is granted once verification is completed.
              </p>
            </div>
          </div>
        </div>
        {/* You can add loading spinner or auto-refresh notice here */}
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Auto-checking verification status...</span>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
