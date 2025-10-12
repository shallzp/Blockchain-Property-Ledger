import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Trash2, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';

const ManageAdmin = () => {
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading, disconnectWallet } = useWeb3();
  const { 
    getAllRegionalAdmins, 
    getPendingRegionalAdminRequests, 
    promoteToRegionalAdmin, 
    removeRegionalAdmin,
    loading: contractLoading
  } = useUserRegistry();

  const [regionalAdmins, setRegionalAdmins] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState(null);
  const [processingAction, setProcessingAction] = useState(''); // 'promote' or 'remove' 

  // Redirect if not Main Admin
//   useEffect(() => {
//     const checkAuth = async () => {
//       if (!isConnected) {
//         navigate('/');
//         return;
//       }
//       try {
//         const userDetails = await getUserRegistryUserDetails(currentAccount);
//         if (userDetails.role !== 'Main Administrator') {
//           navigate('/user/dashboard');
//         }
//       } catch (error) {
//         console.error('Authorization check failed', error);
//         navigate('/');
//       }
//     };
//     if (!web3Loading) checkAuth();
//   }, [isConnected, currentAccount, web3Loading, navigate]);

  // Fetch regional admins and pending requests
  useEffect(() => {
    const fetchAdmins = async () => {
      if (isConnected) {
        setLoading(true);
        try {
          const admins = await getAllRegionalAdmins();
          const requests = await getPendingRegionalAdminRequests();
          setRegionalAdmins(admins);
          setPendingRequests(requests);
        } catch (error) {
          console.error('Failed fetching admins or requests:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAdmins();
  }, [isConnected]);

  // Handle promotion
  const handlePromote = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('promote');
    try {
      await promoteToRegionalAdmin(walletAddress);
      alert(`User ${walletAddress} promoted to Regional Admin`);
      // Refresh lists
      const admins = await getAllRegionalAdmins();
      const requests = await getPendingRegionalAdminRequests();
      setRegionalAdmins(admins);
      setPendingRequests(requests);
    } catch (error) {
      console.error('Promotion failed:', error);
      alert('Failed to promote: ' + error.message);
    }
    setProcessingUser(null);
    setProcessingAction('');
  };

  // Handle removal
  const handleRemove = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('remove');
    try {
      await removeRegionalAdmin(walletAddress);
      alert(`Regional Admin ${walletAddress} removed`);
      // Refresh admins list
      const admins = await getAllRegionalAdmins();
      setRegionalAdmins(admins);
    } catch (error) {
      console.error('Removal failed:', error);
      alert('Failed to remove: ' + error.message);
    }
    setProcessingUser(null);
    setProcessingAction('');
  };

  // Disconnect handler
  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  if (web3Loading || loading || contractLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="Main Administrator" walletAdd={currentAccount} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Main Administrator" walletAdd={currentAccount} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Manage Regional Admins</h1>
          <button onClick={handleDisconnect} className="text-red-600 hover:text-red-700 flex items-center gap-2 font-semibold">
            <XCircle className="w-5 h-5" /> Disconnect
          </button>
        </div>

        {/* Pending Requests */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" /> Pending Regional Admin Requests ({pendingRequests.length})
          </h2>

          {pendingRequests.length === 0 ? (
            <p className="text-gray-500">No pending requests at the moment.</p>
          ) : (
            <div className="grid gap-6">
              {pendingRequests.map((req) => (
                <div key={req.walletAddress} className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-lg border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Wallet Address:</p>
                    <p className="font-mono text-gray-900">{req.walletAddress}</p>
                    <p className="text-sm text-gray-600 mt-2">Requested Role: Regional Admin</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      disabled={processingUser === req.walletAddress && processingAction === 'promote'}
                      onClick={() => handlePromote(req.walletAddress)}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"
                    >
                      {processingUser === req.walletAddress && processingAction === 'promote' ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Approve
                        </>
                      )}
                    </button>
                    <button
                      disabled={processingUser === req.walletAddress && processingAction === 'remove'}
                      onClick={() => handleRemove(req.walletAddress)}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"
                    >
                      {processingUser === req.walletAddress && processingAction === 'remove' ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Current Regional Admins */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-600" /> Current Regional Admins ({regionalAdmins.length})
          </h2>

          {regionalAdmins.length === 0 ? (
            <p className="text-gray-500">No Regional Admins registered yet.</p>
          ) : (
            <div className="grid gap-6">
              {regionalAdmins.map((admin) => (
                <div key={admin.walletAddress} className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <Shield className="w-10 h-10 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Regional Admin</p>
                      <p className="font-mono text-gray-800">{admin.walletAddress}</p>
                      {admin.verified ? (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Verified
                        </p>
                      ) : (
                        <p className="text-sm text-orange-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Pending Verification
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={processingUser === admin.walletAddress && processingAction === 'remove'}
                    onClick={() => handleRemove(admin.walletAddress)}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"
                  >
                    {processingUser === admin.walletAddress && processingAction === 'remove' ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" /> Remove
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ManageAdmin;