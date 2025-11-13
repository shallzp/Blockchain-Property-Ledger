import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle, Home, MapPin, Calendar, AlertCircle } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyExchange } from '../hooks/usePropertyExchange';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';

const Requests = () => {
  const navigate = useNavigate();

  const navItems = useNavItems();

  const [searchParams] = useSearchParams();
  const propertyIdFilter = searchParams.get('propertyId');

  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { getMySales, getRequestedUsers, acceptBuyerRequest } = usePropertyExchange();
  const { getPropertyDetails } = usePropertyRegistry();

  const [filterStatus, setFilterStatus] = useState('all');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'accept' or 'reject'

  // Request state mapping
  const requestStateMap = {
    0: 'pending',        // SentPurchaseRequest
    1: 'cancelled',      // CancelPurchaseRequest
    2: 'accepted',       // SellerAcceptedPurchaseRequest
    3: 'rejected',       // SellerRejectedPurchaseRequest
    4: 'completed'       // SuccessfullyTransfered
  };

  // Redirect if not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (isConnected && currentAccount) {
        try {
          setLoading(true);

          // Get all sales by current user
          const sales = await getMySales(currentAccount);

          // For each sale, get requested users
          const allRequests = [];
          
          for (const sale of sales) {
            // Skip if filtering by property and doesn't match
            if (propertyIdFilter && sale.propertyId.toString() !== propertyIdFilter) {
              continue;
            }

            try {
              const requestedUsers = await getRequestedUsers(sale.saleId);
              const propertyDetails = await getPropertyDetails(sale.propertyId);

              // Convert each requested user to a request object
              for (const reqUser of requestedUsers) {
                allRequests.push({
                  id: `${sale.saleId}-${reqUser.user}`,
                  saleId: sale.saleId,
                  propertyId: sale.propertyId,
                  property: `Property #${sale.propertyId}`,
                  location: `Location ${propertyDetails.locationId}`,
                  buyer: reqUser.user,
                  buyerWallet: reqUser.user,
                  offerPrice: reqUser.priceOffered,
                  status: requestStateMap[reqUser.state] || 'pending',
                  receivedDate: new Date().toLocaleDateString(), // TODO: Get from blockchain events
                  acceptedDate: reqUser.state === 2 ? new Date().toLocaleDateString() : null,
                  requestId: reqUser.requestId,
                  propertyDetails: propertyDetails,
                  saleDetails: sale
                });
              }
            } catch (error) {
              console.error('Error fetching requests for sale:', sale.saleId, error);
            }
          }

          setReceivedRequests(allRequests);

        } catch (error) {
          console.error('Error fetching requests:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequests();
  }, [isConnected, currentAccount, propertyIdFilter]);

  // Filter requests
  const filteredRequests = receivedRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  // Calculate stats
  const stats = {
    total: receivedRequests.length,
    pending: receivedRequests.filter(r => r.status === 'pending').length,
    accepted: receivedRequests.filter(r => r.status === 'accepted').length,
    rejected: receivedRequests.filter(r => r.status === 'rejected').length,
    completed: receivedRequests.filter(r => r.status === 'completed').length
  };

  // Handle accept request
  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);

      await acceptBuyerRequest(
        selectedRequest.saleId,
        selectedRequest.buyer,
        selectedRequest.offerPrice
      );

      alert('Request accepted successfully! Waiting for buyer to complete payment.');
      setShowConfirmModal(false);
      
      // Refresh requests
      window.location.reload();

    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle reject request
  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);

      // TODO: Implement reject functionality if contract supports it
      // Currently, accepting another buyer automatically rejects others
      alert('Reject functionality will be implemented. For now, accepting another buyer will automatically reject this one.');
      setShowConfirmModal(false);

    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal
  const openConfirmModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowConfirmModal(true);
  };

  // Execute action
  const executeAction = () => {
    if (actionType === 'accept') {
      handleAcceptRequest();
    } else if (actionType === 'reject') {
      handleRejectRequest();
    }
  };

  // Loading state
  if (web3Loading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="User" walletAdd={currentAccount} navItems={navItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading purchase requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="User" walletAdd={currentAccount} navItems={navItems} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Requests Received</h1>
          <p className="text-gray-600">Manage purchase requests from potential buyers for your properties</p>
          {propertyIdFilter && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtered by Property:</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                #{propertyIdFilter}
              </span>
              <button
                onClick={() => navigate('/requests')}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-sm text-gray-500">Total</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
            <p className="text-sm text-gray-500">Pending</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.accepted}</h3>
            <p className="text-sm text-gray-500">Accepted</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.rejected}</h3>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        {/* Alert for Pending Requests */}
        {stats.pending > 0 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <div>
                <p className="font-semibold text-orange-900">Action Required</p>
                <p className="text-sm text-orange-700">
                  You have {stats.pending} pending purchase request{stats.pending > 1 ? 's' : ''} waiting for your response.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">Filter by Status:</span>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStatus === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                request.status === 'pending' ? 'border-orange-200 bg-orange-50' :
                request.status === 'accepted' ? 'border-green-200' :
                request.status === 'completed' ? 'border-purple-200' :
                'border-gray-200'
              }`}
            >
              <div className="flex gap-6">
                {/* Property Icon */}
                <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Home className="w-24 h-24 text-white" />
                </div>

                {/* Request Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-bold">
                          #{request.propertyId}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">{request.property}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{request.location}</span>
                      </div>
                    </div>

                    <div>
                      {request.status === 'pending' && (
                        <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-2 animate-pulse">
                          <Clock className="w-4 h-4" />
                          Needs Response
                        </span>
                      )}
                      {request.status === 'accepted' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Accepted
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Rejected
                        </span>
                      )}
                      {request.status === 'completed' && (
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Buyer</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {request.buyer.slice(2, 4).toUpperCase()}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 font-mono">{request.buyerWallet}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Offered Price</p>
                      <p className="text-2xl font-bold text-orange-600">{request.offerPrice} ETH</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Received: {request.receivedDate}</span>
                      </div>
                      {request.acceptedDate && (
                        <div className="flex items-center gap-2 mt-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Accepted: {request.acceptedDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openConfirmModal(request, 'reject')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => openConfirmModal(request, 'accept')}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept Offer
                          </button>
                        </>
                      )}
                      {request.status === 'accepted' && (
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
                          Waiting for buyer payment
                        </div>
                      )}
                      {request.status === 'completed' && (
                        <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
                          Sale Completed ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? "You haven't received any purchase requests yet"
                : `No ${filterStatus} requests found`
              }
            </p>
            <button 
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              View Your Properties
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {actionType === 'accept' ? 'Accept Purchase Request' : 'Reject Purchase Request'}
            </h3>
            
            <div className="mb-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Property</p>
                <p className="text-lg font-bold text-gray-900">#{selectedRequest.propertyId}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Buyer</p>
                <p className="text-sm font-mono text-gray-900">{selectedRequest.buyer}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Offer Price</p>
                <p className="text-2xl font-bold text-orange-600">{selectedRequest.offerPrice} ETH</p>
              </div>

              <div className={`border rounded-lg p-4 ${
                actionType === 'accept' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    actionType === 'accept' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div className={`text-sm ${actionType === 'accept' ? 'text-green-800' : 'text-red-800'}`}>
                    <p className="font-semibold mb-1">
                      {actionType === 'accept' ? 'Confirm Acceptance' : 'Confirm Rejection'}
                    </p>
                    <p>
                      {actionType === 'accept'
                        ? 'By accepting, the buyer will be notified and must complete payment within the deadline.'
                        : 'This action will reject the purchase request. The buyer will be notified.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedRequest(null);
                  setActionType('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                  actionType === 'accept'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {actionType === 'accept' ? 'Accept Request' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;