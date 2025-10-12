import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, CheckCircle, XCircle, Loader, Eye, AlertCircle } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';

const VerifyUser = () => {
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { 
    getPendingUserVerifications, 
    approveUserVerification, 
    rejectUserVerification, 
    loading: contractLoading 
  } = useUserRegistry();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState(null);
  const [processingAction, setProcessingAction] = useState(''); // 'approve' or 'reject'
  const [error, setError] = useState('');

  // Redirect if not Regional Admin - ideally enforced on routing level
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch pending verification users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (isConnected) {
        setLoading(true);
        try {
          const users = await getPendingUserVerifications();
          setPendingUsers(users);
        } catch (err) {
          console.error('Error fetching pending users:', err);
          setError('Failed to load pending verifications.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPendingUsers();
  }, [isConnected, getPendingUserVerifications]);

  // Approve user verification
  const handleApprove = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('approve');
    setError('');
    try {
      await approveUserVerification(walletAddress);
      alert(`User ${walletAddress} approved successfully.`);
      setPendingUsers(prev => prev.filter(user => user.walletAddress !== walletAddress));
    } catch (err) {
      console.error('Approve failed:', err);
      setError('Failed to approve user.');
    } finally {
      setProcessingUser(null);
      setProcessingAction('');
    }
  };

  // Reject user verification
  const handleReject = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('reject');
    setError('');
    try {
      await rejectUserVerification(walletAddress);
      alert(`User ${walletAddress} rejected.`);
      setPendingUsers(prev => prev.filter(user => user.walletAddress !== walletAddress));
    } catch (err) {
      console.error('Reject failed:', err);
      setError('Failed to reject user.');
    } finally {
      setProcessingUser(null);
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
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCheck className="w-7 h-7 text-blue-600" />
            Pending User Verifications
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
            <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-300 shadow-lg">
            <AlertCircle className="mx-auto w-16 h-16 text-gray-400 mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Users Awaiting Verification</h2>
            <p className="text-gray-600">All users have been verified or no pending KYC requests.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingUsers.map((user) => (
              <div 
                key={user.walletAddress} 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6 flex-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 rounded-xl font-semibold text-lg uppercase">
                    {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-600 font-mono">{user.walletAddress}</p>
                    <p className="text-sm text-gray-600 italic">{user.email}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-500 max-w-sm md:max-w-md whitespace-pre-wrap">
                  <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
                  <p><strong>Resident Address:</strong> {user.resAddress}</p>
                  <p><strong>Aadhaar Number:</strong> {user.aadharNumber}</p>
                  <p>
                    <strong>Aadhaar Document:</strong> {' '}
                    {user.aadharFileHash ? (
                      <a 
                        href={`https://ipfs.io/ipfs/${user.aadharFileHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-orange-600 hover:underline"
                      >
                        View on IPFS
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Not uploaded</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-4 flex-shrink-0">
                  <button
                    disabled={processingUser === user.walletAddress && processingAction === 'approve'}
                    onClick={() => handleApprove(user.walletAddress)}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg px-5 py-3 flex items-center gap-2 font-semibold"
                  >
                    {processingUser === user.walletAddress && processingAction === 'approve' ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" /> Approve
                      </>
                    )}
                  </button>

                  <button
                    disabled={processingUser === user.walletAddress && processingAction === 'reject'}
                    onClick={() => handleReject(user.walletAddress)}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg px-5 py-3 flex items-center gap-2 font-semibold"
                  >
                    {processingUser === user.walletAddress && processingAction === 'reject' ? (
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

export default VerifyUser;
