import { AlertCircle, Clock, RefreshCw } from 'lucide-react';

const PendingVerification = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-12 h-12 text-orange-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Verification Pending</h1>
        <p className="text-center text-gray-600 mb-8">
          Your account has been created successfully and is awaiting Regional Admin approval.
        </p>

        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200 mb-8">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900 mb-2">What happens next</p>
              <p className="text-sm text-orange-700 mb-3">
                A Regional Admin will review your registration and KYC documents. This usually takes 24-48 hours.
              </p>
              <p className="text-sm text-orange-600">
                You will be redirected to your account pages automatically once verification is complete.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Checking verification status on refresh</span>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
