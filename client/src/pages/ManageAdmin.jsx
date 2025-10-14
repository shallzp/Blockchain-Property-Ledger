import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Trash2, Loader, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';

const ManageAdmin = () => {
  const navigate = useNavigate();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const {
    getAllRegionalAdmins,
    addRegionalAdmin,
    removeRegionalAdmin,
    getUserDetails,
    updateAdminRevenueDept,
    getAdminCountByRevenueDept,
    loading: contractLoading,
  } = useUserRegistry();

  const [regionalAdmins, setRegionalAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState(null);
  const [processingAction, setProcessingAction] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [newRevenueDept, setNewRevenueDept] = useState('');
  const [revenueDeptId, setRevenueDeptId] = useState('');
  const [employeesCount, setEmployeesCount] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isConnected) {
        navigate('/');
        return;
      }
      try {
        const userDetails = await getUserDetails(currentAccount);
        if (!userDetails || userDetails.role !== 'Main Administrator') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Authorization check failed', error);
        navigate('/');
      }
    };
    if (!web3Loading) checkAuth();
  }, [isConnected, currentAccount, web3Loading, navigate, getUserDetails]);

  // === Updated/Fixes: FETCH ADMINS ON LOAD ===
  useEffect(() => {
    const fetchAdmins = async () => {
      if (isConnected) {
        setLoading(true);
        try {
          const admins = await getAllRegionalAdmins();
          // Adapt for your data shape: if returns pure address[], convert to object if needed
          // Here we assume the contract returns address[] and you'll fetch more details per admin below if required.
          // For richer response, you may want to fetch each admin's details and set array of { walletAddress, ... } objects.
          setRegionalAdmins(
            admins.map(addr => ({
              walletAddress: addr,
              // Make additional info available for UI:
              verified: true, // If available, or fetch detail from getUserDetails
            }))
          );
        } catch (error) {
          console.error('Failed fetching admins:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAdmins();
  }, [isConnected, getAllRegionalAdmins]);

  // Fetch number of employees in a revenue dept
  const fetchEmployeesInDept = async () => {
    if (!revenueDeptId) {
      alert('Please enter a Revenue Department ID');
      return;
    }
    try {
      const count = await getAdminCountByRevenueDept(revenueDeptId);
      setEmployeesCount(count);
    } catch (error) {
      console.error('Failed to fetch employee count:', error);
      alert('Failed to get employee count: ' + error.message);
    }
  };

  const handleAddAdmin = async (event) => {
    event.preventDefault();
    if (!newAdminAddress || !newRevenueDept) {
      alert('Please enter all details');
      return;
    }
    setProcessingUser(newAdminAddress);
    setProcessingAction('promote');
    try {
      await addRegionalAdmin, (newAdminAddress, newRevenueDept);
      alert(`User ${newAdminAddress} promoted to Regional Admin with Revenue Dept ${newRevenueDept}`);
      setNewAdminAddress('');
      setNewRevenueDept('');
      setShowAddModal(false);
      const admins = await getAllRegionalAdmins();
      setRegionalAdmins(admins.map(addr => ({ walletAddress: addr, verified: true })));
    } catch (error) {
      console.error('Promotion failed:', error);
      alert('Failed to promote: ' + error.message);
    }
    setProcessingUser(null);
    setProcessingAction('');
  };

  const handleRemove = async (walletAddress) => {
    setProcessingUser(walletAddress);
    setProcessingAction('remove');
    try {
      await removeRegionalAdmin(walletAddress);
      alert(`Regional Admin ${walletAddress} removed`);
      const admins = await getAllRegionalAdmins();
      setRegionalAdmins(admins.map(addr => ({ walletAddress: addr, verified: true })));
    } catch (error) {
      console.error('Removal failed:', error);
      alert('Failed to remove: ' + error.message);
    }
    setProcessingUser(null);
    setProcessingAction('');
  };

  const handleUpdateRevenueDept = async (walletAddress, newDeptId) => {
    if (!newDeptId) {
      alert('Please provide a valid Revenue Dept ID');
      return;
    }
    try {
      await updateAdminRevenueDept(walletAddress, newDeptId);
      alert(`Updated Revenue Dept for admin ${walletAddress} to ${newDeptId}`);
      const admins = await getAllRegionalAdmins();
      setRegionalAdmins(admins.map(addr => ({ walletAddress: addr, verified: true })));
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update Revenue Dept: ' + error.message);
    }
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
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <UserPlus className="w-5 h-5" /> Add Regional Admin
          </button>
        </div>

        {/* View number of employees by Revenue Dept */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">View Employees by Revenue Department</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter Revenue Dept ID"
              value={revenueDeptId}
              onChange={(e) => setRevenueDeptId(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <button
              onClick={fetchEmployeesInDept}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2"
            >
              Get Count
            </button>
          </div>
          {employeesCount !== null && (
            <p className="mt-4 text-gray-700">Number of employees in dept {revenueDeptId}: {employeesCount}</p>
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
                      <input
                        type="text"
                        placeholder="Update Revenue Dept ID"
                        className="border rounded px-2 py-1 mt-2"
                        onBlur={(e) => handleUpdateRevenueDept(admin.walletAddress, e.target.value)}
                      />
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

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add New Regional Admin</h3>
            <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Wallet Address"
                value={newAdminAddress}
                onChange={(e) => setNewAdminAddress(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Revenue Department ID"
                value={newRevenueDept}
                onChange={(e) => setNewRevenueDept(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
              <button
                type="submit"
                disabled={processingUser !== null}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
              >
                {processingUser ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Promote to Regional Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;