import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Users, Shield, Home, ChevronRight, Plus, CheckCircle } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';

const MainAdminDashboard = () => {
  const navItems = useNavItems();
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { getTotalUsers, getRegionalAdminCount, getAllRegionalAdmins } = useUserRegistry();
  const { getTotalProperties } = usePropertyRegistry();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    localAdmins: 0,
  });
  const [localAdmins, setLocalAdmins] = useState([]);

  useEffect(() => {
    if (!web3Loading && !isConnected) navigate("/");
  }, [isConnected, web3Loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [totalUsers, regionalAdminCount, totalProps, admins] = await Promise.all([
          getTotalUsers(),
          getRegionalAdminCount(),
          getTotalProperties(),
          getAllRegionalAdmins(),
        ]);
        setStats(prev => ({
          ...prev,
          totalUsers: Number(totalUsers),
          localAdmins: Number(regionalAdminCount),
          totalProperties: Number(totalProps),
        }));
        setLocalAdmins(admins.map(addr => ({ wallet: addr, name: addr.slice(0, 6) + '...' /* placeholder */, region: 'N/A' })));
      } catch (e) {
        setStats({
          totalUsers: 0,
          totalProperties: 0,
          localAdmins: 0,
          activeAdmins: 0,
    
          totalTransactions: 0,
        });
        setLocalAdmins([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [getTotalUsers, getRegionalAdminCount, getTotalProperties, getAllRegionalAdmins]);

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
                  onClick={() => navigate('/main/manage-admin')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 text-sm hover:bg-orange-600 transition"
                >
                  <Plus className="w-4 h-4" /> Add Admin
                </button>
              </div>
              {localAdmins.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No regional admins yet.</div>
              ) : (
                <div className="space-y-7">
                  {localAdmins.map((admin, idx) => (
                    <div key={admin.wallet || idx} className="flex items-center bg-slate-50 rounded-2xl shadow border border-gray-100 p-8 mb-2">
                      <div className="flex-shrink-0 mr-5">
                        <Shield className="w-10 h-10 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Regional Admin</h3>
                        <p className="font-mono text-base text-gray-800 break-all">{admin.wallet}</p>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium text-base">Verified</span>
                        </div>
                      </div>
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