import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Building2, Users, Home, Clock, FileCheck, CheckCircle, XCircle, Eye, ChevronRight } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navItems = useNavItems();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { 
    getPendingUserVerifications, 
    approveUserVerification, 
    rejectUserVerification, 
    loading: contractLoading 
  } = useUserRegistry();

  // Dynamic dashboard stats
  const [stats, setStats] = useState({
    region: '',
    totalUsers: 0,
    verifiedUsers: 0,
    pendingKYC: 0,
    totalProperties: 0,
    verifiedProperties: 0,
    activeListings: 0
  });

  // Pending KYC data
  const [pendingKYC, setPendingKYC] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState(null);
  const [processingAction, setProcessingAction] = useState('');
  const [error, setError] = useState('');

  // Fetch Admin Stats and KYC (update or add your real stats retrieval here)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with real contract/stat fetching as needed
        // const adminStats = await getAdminStats();
        // setStats(adminStats);

        const pending = await getPendingUserVerifications();
        setPendingKYC(pending);
        setStats(prev => ({
          ...prev,
          pendingKYC: pending.length
        }));
      } catch (err) {
        setPendingKYC([]);
        setError('Failed to load KYC stats');
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [getPendingUserVerifications]);

  // Approve/Reject KYC
  const handleApproveKYC = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('approve');
    setError('');
    try {
      await approveUserVerification(walletAddress);
      setPendingKYC(prev => prev.filter(user => user.walletAddress !== walletAddress));
      // Optionally, re-fetch full dashboard data here if stats could change
    } catch (err) {
      setError(err.message || 'Failed to approve user.');
      console.error('Approve failed:', err);
    } finally {
      setProcessingUser(null);
      setProcessingAction('');
    }
  };
  const handleRejectKYC = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('reject');
    setError('');
    try {
      await rejectUserVerification(walletAddress);
      setPendingKYC(prev => prev.filter(user => user.walletAddress !== walletAddress));
      // Optionally, re-fetch full dashboard data here if stats could change
    } catch (err) {
      setError(err.message || 'Failed to reject user.');
      console.error('Reject failed:', err);
    } finally {
      setProcessingUser(null);
      setProcessingAction('');
    }
  };

  if (web3Loading || loading || contractLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar userRole="Regional Admin" walletAdd={currentAccount} navItems={navItems} />
      {/* Header */}
      <div className="relative px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Regional Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Managing users & properties</p>
            </div>
          </div>
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalUsers}
              </h3>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalProperties}
              </h3>
              <p className="text-sm text-gray-500">Total Properties</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.pendingKYC}
              </h3>
              <p className="text-sm text-gray-500">Pending Verification</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-purple-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.activeListings}
              </h3>
              <p className="text-sm text-gray-500">Active Listings</p>
            </div>
          </div>
          {/* Pending KYC Table/List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mt-10">
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-700">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Verifications</h3>
              <div className="space-y-4">
                {pendingKYC.length === 0 ? (
                  <div className="text-center text-gray-500 p-8">No pending KYC verifications.</div>
                ) : (
                  pendingKYC.map((user, idx) => (
                    <div key={user.walletAddress || idx} className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.firstName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                              <p className="text-sm font-mono text-gray-900">{user.walletAddress}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                              <p className="text-sm text-gray-900">{user.phone || 'Not Provided'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-6">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2" disabled>
                            <Eye className="w-4 h-4" />
                            View Documents
                          </button>
                          <button
                            onClick={() => handleApproveKYC(user.walletAddress)}
                            disabled={processingUser === user.walletAddress && processingAction === 'approve'}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                          >
                            {processingUser === user.walletAddress && processingAction === 'approve' ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectKYC(user.walletAddress)}
                            disabled={processingUser === user.walletAddress && processingAction === 'reject'}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                          >
                            {processingUser === user.walletAddress && processingAction === 'reject' ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;