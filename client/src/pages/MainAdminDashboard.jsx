import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Users, Shield, Home, FileText, Eye, CheckCircle, XCircle, Pause, Play, History, MapPin, ChevronRight, Bell, Plus } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
// import your main admin contract hooks here

const MainAdminDashboard = () => {
  const navItems = useNavItems();
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();

  // Data model: replace with real contract fetches
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    localAdmins: 0,
    activeAdmins: 0,
    pendingAdmins: 0,
    totalTransactions: 0,
  });
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [localAdmins, setLocalAdmins] = useState([]);

  useEffect(() => {
    if (!web3Loading && !isConnected) navigate("/");
  }, [isConnected, web3Loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // load admin stats and lists, replace with real contract/API calls
        // setStats(await getMainAdminStats());
        // setPendingAdmins(await getPendingAdminRequests());
        // setLocalAdmins(await getLocalAdmins());
      } catch (e) {
        setStats({
          totalUsers: 0,
          totalProperties: 0,
          localAdmins: 0,
          activeAdmins: 0,
          pendingAdmins: 0,
          totalTransactions: 0,
        });
        setPendingAdmins([]);
        setLocalAdmins([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (web3Loading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar userRole="Main Administrator" walletAdd={currentAccount} navItems={navItems} />
      <div className="relative px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Main Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Monitor and control all PropChain platform operations</p>
            </div>
          </div>
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <button className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</h3>
              <p className="text-sm text-gray-500">Total Users</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProperties}</h3>
              <p className="text-sm text-gray-500">Total Properties</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-left hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.localAdmins}</h3>
              <p className="text-sm text-gray-500">Total Regional Admins</p>
            </button>
          </div>
          {/* Regional Admins list */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mt-12">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex-1">Regional Admins</h2>
                <button
                  onClick={() => navigate('/add-admin')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 text-sm hover:bg-orange-600 transition"
                >
                  <Plus className="w-4 h-4" /> Add Admin
                </button>
              </div>
              {localAdmins.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No regional admins yet.</div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {localAdmins.map((admin, idx) => (
                    <div key={admin.wallet || idx} className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:border-blue-400 transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {admin.name?.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-gray-600">{admin.region}</span>
                        <button
                          onClick={() => navigate(`/profile/${admin.wallet}`)}
                          className="ml-auto p-2 hover:bg-blue-50 rounded-full transition"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{admin.name}</h3>
                      <p className="text-xs text-gray-500">{admin.wallet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAdminDashboard;
