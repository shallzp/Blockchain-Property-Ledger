import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Building2, Users, Home, Clock, FileCheck, TrendingUp, CheckCircle, XCircle, Eye, ChevronRight } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useUserRegistry } from '../hooks/useUserRegistry';

const AdminDashboard = () => {
  const navItems = useNavItems();
  const navigate = useNavigate();
  const { getPendingUserVerifications } = useUserRegistry();

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

  // Fetch Admin Stats and KYC
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with real contract/stat fetching
        // const adminStats = await getAdminStats(); (implement)
        // setStats(adminStats);

        const pending = await getPendingUserVerifications();
        setPendingKYC(pending);
        setStats(prev => ({
          ...prev,
          pendingKYC: pending.length
        }));
      } catch {
        setPendingKYC([]);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [getPendingUserVerifications]);

  // Approve/Reject KYC (implement backend)
  const handleApproveKYC = async (walletAddress) => {
    // await approveUserVerification(walletAddress);
    // Refresh dashboard data after approve
  };
  const handleRejectKYC = async (walletAddress) => {
    // await rejectUserVerification(walletAddress);
    // Refresh dashboard data after reject
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar userRole="Regional Admin" navItems={navItems} />
      {/* Header */}
      <div className="relative px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Local Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Region: {stats.region || '...'} • Managing property records</p>
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
              <p className="text-sm text-gray-500">Pending KYC</p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pending KYC Verifications</h3>
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
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs text-gray-600">Documents:</span>
                            {user.documents?.map((doc, index) => (
                              <span key={index} className="px-2 py-1 bg-white border border-orange-300 rounded text-xs">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-6">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Documents
                          </button>
                          <button
                            onClick={() => handleApproveKYC(user.walletAddress)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectKYC(user.walletAddress)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
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