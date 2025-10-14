import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, CheckCircle, XCircle, Eye, Home, MapPin, User, Calendar, DollarSign, AlertCircle } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { usePropertyExchange } from '../hooks/usePropertyExchange';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';

const Requested = () => {
  const navigate = useNavigate();
  
  const navItems = useNavItems();
  
  const { isConnected, currentAccount, web3, loading: web3Loading } = useWeb3();
  const { getRequestedSales, transferOwnership, getStatusOfPurchaseRequest } = usePropertyExchange();
  const { getPropertyDetails } = usePropertyRegistry();

  const [filterStatus, setFilterStatus] = useState('all');
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Status mapping
  const statusMap = {
    0: 'pending',      // SentPurchaseRequest
    1: 'cancelled',    // CancelPurchaseRequest
    2: 'accepted',     // SellerAcceptedPurchaseRequest
    3: 'rejected',     // SellerRejectedPurchaseRequest
    4: 'completed'     // SuccessfullyTransfered
  };

  // Redirect if not connected
  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
    }
  }, [isConnected, web3Loading, navigate]);

  // Fetch requested properties
  useEffect(() => {
    const fetchRequests = async () => {
      if (isConnected && currentAccount) {
        try {
          setLoading(true);

          // Get all sales user has requested
          const sales = await getRequestedSales(currentAccount);

          // Fetch property details for each sale
          const requestsWithDetails = await Promise.all(
            sales.map(async (sale) => {
              try {
                const property = await getPropertyDetails(sale.propertyId);
                
                // Get request status for this user
                const requestStatus = await getStatusOfPurchaseRequest(sale.saleId);

                return {
                  id: sale.saleId,
                  propertyId: sale.propertyId,
                  property: `Property #${sale.propertyId}`,
                  location: `Location ${property.locationId}`,
                  seller: sale.owner,
                  sellerWallet: sale.owner,
                  offerPrice: sale.acceptedPrice || sale.price,
                  askingPrice: sale.price,
                  status: statusMap[requestStatus.state] || 'pending',
                  sentDate: new Date().toLocaleDateString(), // TODO: Get from blockchain events
                  acceptedDate: sale.acceptedTime > 0 ? new Date(parseInt(sale.acceptedTime) * 1000).toLocaleDateString() : null,
                  deadline: sale.deadlineForPayment > 0 ? new Date(parseInt(sale.deadlineForPayment) * 1000) : null,
                  paymentDone: sale.paymentDone,
                  saleState: sale.state,
                  propertyDetails: property,
                  requestDetails: requestStatus
                };
              } catch (error) {
                console.error('Error fetching property details:', error);
                return null;
              }
            })
          );

          // Filter out null values
          const validRequests = requestsWithDetails.filter(r => r !== null);
          setSentRequests(validRequests);

        } catch (error) {
          console.error('Error fetching requests:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequests();
  }, [isConnected, currentAccount]);

  // Filter requests
  const filteredRequests = sentRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  // Calculate stats
  const stats = {
    total: sentRequests.length,
    pending: sentRequests.filter(r => r.status === 'pending').length,
    accepted: sentRequests.filter(r => r.status === 'accepted').length,
    rejected: sentRequests.filter(r => r.status === 'rejected').length,
    completed: sentRequests.filter(r => r.status === 'completed').length
  };

  // Handle complete purchase (payment)
  const handleCompletePurchase = async (request) => {
    setSelectedRequest(request);
    setShowPaymentModal(true);
  };

  // Process payment
  const processPayment = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);

      // Call transferOwnership with payment
      await transferOwnership(selectedRequest.id, selectedRequest.offerPrice);

      alert('Purchase completed successfully! Property ownership transferred.');
      setShowPaymentModal(false);
      
      // Refresh requests
      window.location.reload();

    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Failed to complete purchase: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if deadline passed
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date() > deadline;
  };

  // Loading state
  if (web3Loading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="User" walletAdd={currentAccount} navItems={navItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="User" walletAdd={currentAccount} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Purchase Requests</h1>
          <p className="text-gray-600">Track all property purchase requests you've sent</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-sm text-gray-500">Total Requests</p>
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

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-8">
          <div className="flex items-center gap-4">
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
                request.status === 'pending' ? 'border-orange-200' :
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
                        <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      {request.status === 'accepted' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Accepted - Pay Now!
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
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Seller</p>
                      <p className="text-xs text-gray-600 font-mono">{request.sellerWallet}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Your Offer</p>
                      <p className="text-2xl font-bold text-orange-600">{request.offerPrice} ETH</p>
                    </div>
                  </div>

                  {/* Deadline Warning */}
                  {request.status === 'accepted' && request.deadline && (
                    <div className={`border rounded-lg p-4 mb-4 ${
                      isDeadlinePassed(request.deadline)
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {isDeadlinePassed(request.deadline) ? 'Payment Deadline Passed!' : 'Payment Deadline'}
                      </p>
                      <p className="text-sm">
                        {isDeadlinePassed(request.deadline)
                          ? 'This offer has expired. The seller may cancel the sale.'
                          : `Complete payment by ${request.deadline.toLocaleString()}`
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Sent: {request.sentDate}</span>
                      </div>
                      {request.acceptedDate && (
                        <div className="flex items-center gap-2 mt-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Accepted: {request.acceptedDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {request.status === 'accepted' && !request.paymentDone && !isDeadlinePassed(request.deadline) && (
                        <button
                          onClick={() => handleCompletePurchase(request)}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2 animate-pulse"
                        >
                          <DollarSign className="w-4 h-4" />
                          Pay {request.offerPrice} ETH
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/property/${request.propertyId}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Property
                      </button>
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
            <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? "You haven't sent any purchase requests yet" 
                : `No ${filterStatus} requests found`
              }
            </p>
            <button 
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Explore Properties
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Purchase</h3>
            
            <div className="mb-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Property</p>
                <p className="text-lg font-bold text-gray-900">#{selectedRequest.propertyId}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
                <p className="text-3xl font-bold text-orange-600">{selectedRequest.offerPrice} ETH</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important</p>
                    <p>This transaction will transfer {selectedRequest.offerPrice} ETH from your wallet and transfer property ownership to you.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requested;


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Send, Clock, CheckCircle, XCircle, Eye, Home, MapPin, User, Calendar, DollarSign, AlertCircle } from 'lucide-react';

// import Navbar from '../components/Navbar';
// import { useWeb3 } from '../context/Web3Context';
// import { usePropertyExchange } from '../hooks/usePropertyExchange';
// import { usePropertyRegistry } from '../hooks/usePropertyRegistry';

// const Requested = () => {
//   const navigate = useNavigate();

//   const navItems = [
//     { to: '/user/dashboard', label: 'Home', icon: Home },
//     { to: '/profile', label: 'Profile', icon: User },
//     { to: '/user/properties', label: 'Properties', icon: FileText },
//     { to: '/user/requests', label: 'Requests', icon: Eye },
//     { to: '/user/requested', label: 'Requested', icon: Send },
//     { to: '/user/explore', label: 'Explore', icon: Search }
//   ];

//   const { isConnected, currentAccount, web3 } = useWeb3();
//   const { getRequestedSales, transferOwnership, getStatusOfPurchaseRequest } = usePropertyExchange();
//   const { getPropertyDetails } = usePropertyRegistry();

//   const [sentRequests, setSentRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   const statusMap = {
//     0: 'pending',
//     1: 'cancelled',
//     2: 'accepted',
//     3: 'rejected',
//     4: 'completed'
//   };

//   useEffect(() => {
//     if (!web3.loading && !isConnected) {
//       navigate('/');
//     }
//   }, [isConnected, web3.loading, navigate]);

//   // Fetch requests
//   useEffect(() => {
//     const fetchRequests = async () => {
//       if (isConnected && currentAccount) {
//         try {
//           setLoading(true);
//           const sales = await getRequestedSales(currentAccount);
//           const requests = await Promise.all(sales.map(async (sale) => {
//             try {
//               const property = await getPropertyDetails(sale.propertyId);
//               const requestStatusData = await getStatusOfPurchaseRequest(sale.saleId);
//               return {
//                 id: sale.saleId,
//                 propertyId: sale.propertyId,
//                 property: `Property #${sale.propertyId}`,
//                 location: `Location ${property.locationId}`,
//                 seller: sale.owner,
//                 sellerWallet: sale.owner,
//                 offerPrice: sale.acceptedPrice || sale.price,
//                 askingPrice: sale.price,
//                 status: statusMap[requestStatusData.state] || 'pending',
//                 sentDate: new Date().toLocaleDateString(),
//                 acceptedDate: sale.acceptedTime > 0 ? new Date(parseInt(sale.acceptedTime) * 1000).toLocaleDateString() : null,
//                 deadline: sale.deadlineForPayment > 0 ? new Date(parseInt(sale.deadlineForPayment) * 1000) : null,
//                 paymentDone: sale.paymentDone,
//                 saleState: sale.state,
//                 propertyDetails: property,
//                 requestDetails: requestStatusData
//               };
//             } catch (error) {
//               console.error('Error fetching property details:', error);
//               return null;
//             }
//           }));
//           setSentRequests(requests.filter(r => r));
//         } catch (error) {
//           console.error('Error fetching requests:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchRequests();
//   }, [isConnected, currentAccount, getRequestedSales, getPropertyDetails, getStatusOfPurchaseRequest]);

//   // Filter requests
//   const filteredRequests = sentRequests.filter(r => {
//     if (filterStatus === 'all') return true;
//     return r.status === filterStatus;
//   });

//   // Calculate stats
//   const stats = {
//     total: sentRequests.length,
//     pending: sentRequests.filter(r => r.status === 'pending').length,
//     accepted: sentRequests.filter(r => r.status === 'accepted').length,
//     rejected: sentRequests.filter(r => r.status === 'rejected').length,
//     completed: sentRequests.filter(r => r.status === 'completed').length
//   };

//   const handleCompletePurchase = (request) => {
//     setSelectedRequest(request);
//     setShowPaymentModal(true);
//   };

//   const processPayment = async () => {
//     if (!selectedRequest) return;
//     setLoading(true);
//     try {
//       await transferOwnership(selectedRequest.id, selectedRequest.offerPrice);
//       alert('Purchase successful!');
//       setShowPaymentModal(false);
//       setSelectedRequest(null);
//       // Refresh requests after purchase
//       // Instead of window.location.reload(), refresh data
//       // You can trigger fetch request function here again or update state accordingly
//     } catch (error) {
//       alert('Failed to complete purchase: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isDeadlinePassed = (deadline) => {
//     if (!deadline) return false;
//     return new Date() > deadline;
//   };

//   if (web3.loading || loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your requests...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
//       <Navbar userRole="User" walletAdd={currentAccount} />
//       {/* Rest of your JSX for displaying requests, filters, and modals */}
//       {showPaymentModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6">
//             <h3 className="text-2xl font-bold mb-4">Complete Purchase</h3>
//             <div className="mb-6 space-y-4">
//               {/* Modal content */}
//               <p>Property #{selectedRequest.propertyId}</p>
//               <p>Amount: {selectedRequest.offerPrice} ETH</p>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowPaymentModal(false); setSelectedRequest(null); }} className="flex-1 bg-gray-100 py-2 rounded-lg">Cancel</button>
//               <button onClick={processPayment} className="flex-1 bg-green-500 py-2 rounded-lg text-white">Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Requested;