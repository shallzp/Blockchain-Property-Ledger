import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';
import { useNavigate } from 'react-router-dom';
import { Loader, CheckCircle, XCircle, AlertCircle, MapPin, Maximize, FileText, Home, Calendar } from 'lucide-react';

const VerifyProperty = () => {
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { 
    getPendingPropertiesForVerification, 
    verifyPropertyRegistration, 
    rejectPropertyRegistration,
    loading: contractLoading
  } = usePropertyRegistry();

  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingProperty, setProcessingProperty] = useState(null);
  const [processingAction, setProcessingAction] = useState(''); // 'verify' or 'reject'
  const [error, setError] = useState('');

  // Redirect if not Regional Admin - ensure auth elsewhere
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch properties pending verification
  useEffect(() => {
    const fetchPendingProperties = async () => {
      if (isConnected) {
        setLoading(true);
        try {
          const properties = await getPendingPropertiesForVerification();
          setPendingProperties(properties);
        } catch (err) {
          console.error('Error fetching pending properties:', err);
          setError('Failed to load pending properties for verification.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPendingProperties();
  }, [isConnected, getPendingPropertiesForVerification]);

  // Verify property
  const handleVerify = async (propertyId) => {
    setProcessingProperty(propertyId);
    setProcessingAction('verify');
    setError('');
    try {
      await verifyPropertyRegistration(propertyId);
      alert(`Property #${propertyId} verified successfully.`);
      setPendingProperties(prev => prev.filter(p => p.propertyId !== propertyId));
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Failed to verify property.');
    } finally {
      setProcessingProperty(null);
      setProcessingAction('');
    }
  };

  // Reject property
  const handleReject = async (propertyId) => {
    setProcessingProperty(propertyId);
    setProcessingAction('reject');
    setError('');
    try {
      await rejectPropertyRegistration(propertyId);
      alert(`Property #${propertyId} rejected.`);
      setPendingProperties(prev => prev.filter(p => p.propertyId !== propertyId));
    } catch (err) {
      console.error('Rejection failed:', err);
      setError('Failed to reject property.');
    } finally {
      setProcessingProperty(null);
      setProcessingAction('');
    }
  };

  if (web3Loading || loading || contractLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="Regional Admin" walletAdd={currentAccount} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader className="w-16 h-16 animate-spin text-orange-500 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Regional Admin" walletAdd={currentAccount} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <Home className="w-9 h-9 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Verify Property Registrations</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
            <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {pendingProperties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-20 text-center border border-gray-300">
            <AlertCircle className="mx-auto w-20 h-20 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Properties to Verify</h2>
            <p className="text-gray-600">There are currently no new property registrations pending verification.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingProperties.map((property) => (
              <div 
                key={property.propertyId} 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6 md:items-center justify-between"
              >
                <div className="flex gap-6 flex-1">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    #{property.propertyId}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{property.title || `Property #${property.propertyId}`}</h3>
                    <p className="text-sm text-gray-600 mb-2"><MapPin className="w-4 h-4 inline text-orange-500" /> Location ID: {property.locationId}</p>
                    <p className="text-sm text-gray-600 mb-2"><Maximize className="w-4 h-4 inline text-orange-500" /> Area: {property.area} sq ft</p>
                    <p className="text-sm text-gray-600 mb-2"><FileText className="w-4 h-4 inline text-orange-500" /> Survey Number: {property.surveyNumber}</p>
                    <p className="text-sm text-gray-600 mb-2"><Calendar className="w-4 h-4 inline text-orange-500" /> Registered on: {property.registrationDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-4 flex-shrink-0">
                  <button
                    disabled={processingProperty === property.propertyId && processingAction === 'verify'}
                    onClick={() => handleVerify(property.propertyId)}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg px-6 py-3 flex items-center gap-2 font-semibold"
                  >
                    {processingProperty === property.propertyId && processingAction === 'verify' ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" /> Verify
                      </>
                    )}
                  </button>
                  <button
                    disabled={processingProperty === property.propertyId && processingAction === 'reject'}
                    onClick={() => handleReject(property.propertyId)}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg px-6 py-3 flex items-center gap-2 font-semibold"
                  >
                    {processingProperty === property.propertyId && processingAction === 'reject' ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" /> Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyProperty;
