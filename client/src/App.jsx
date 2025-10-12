import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import UserDashboard from './pages/UserDashboard';
import Registration from './pages/Registration';
import MainAdminDashboard from './pages/MainAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import Requests from './pages/Requests';
import Requested from './pages/Requested';
import Explore from './pages/Explore';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Landing/> } />
        
        <Route path="/register" element={ <Registration/> } />
        
        <Route path="/dashboard" element={ <UserDashboard/> } />
        <Route path="/super" element={ <MainAdminDashboard/> } />
        <Route path="/admin" element={ <AdminDashboard/> } />

        <Route path="/profile" element={ <Profile/> } />
        <Route path="/properties" element={ <Properties/> } />
        <Route path="/add-property" element={ <AddProperty/> } />
        <Route path="/requests" element={ <Requests/> }/>
        <Route path="/requested" element={ <Requested/> }/>
        <Route path="/explore" element={ <Explore/> }/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App

// import { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// import Landing from './pages/Landing';
// import UserDashboard from './pages/UserDashboard';
// import Registration from './pages/Registration';
// import MainAdminDashboard from './pages/MainAdminDashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Profile from './pages/Profile';
// import PendingVerification from './pages/PendingVerification';
// import Properties from './pages/Properties';
// import AddProperty from './pages/AddProperty';
// import Requests from './pages/Requests';
// import Requested from './pages/Requested';
// import Explore from './pages/Explore';

// import { Web3Provider, useWeb3 } from './context/Web3Context';
// import { useUserRegistry } from './hooks/useUserRegistry';

// // Protected Route Component
// function ProtectedRoute({ children }) {
//   const navigate = useNavigate();
//   const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
//   const { isUserRegistered, getUserDetails } = useUserRegistry();
//   const [checking, setChecking] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (!web3Loading) {
//         if (!isConnected || !currentAccount) {
//           navigate('/');
//           return;
//         }

//         try {
//           // Check if address is registered
//           const registered = await isUserRegistered(currentAccount);

//           if (!registered) {
//             // Show registration form
//             navigate('/registration');
//             return;
//           }

//           // Get user details
//           const userDetails = await getUserDetails(currentAccount);
//           const verified = userDetails.verified;
//           const role = userDetails.role;

//           if (!verified) {
//             // Show "Pending Verification" page
//             navigate('/pending-verification');
//             return;
//           }

//           // User is registered and verified
//           setAuthorized(true);

//         } catch (error) {
//           console.error('Auth check error:', error);
//           navigate('/');
//         } finally {
//           setChecking(false);
//         }
//       }
//     };

//     checkAuth();
//   }, [isConnected, currentAccount, web3Loading, navigate]);

//   if (web3Loading || checking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return authorized ? children : null;
// }

// // Role-Based Route Component
// function RoleRoute({ children, allowedRoles }) {
//   const navigate = useNavigate();
//   const { currentAccount } = useWeb3();
//   const { getUserDetails } = useUserRegistry();
//   const [checking, setChecking] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const checkRole = async () => {
//       try {
//         const userDetails = await getUserDetails(currentAccount);
//         const userRole = userDetails.role;

//         if (allowedRoles.includes(userRole)) {
//           setAuthorized(true);
//         } else {
//           // Redirect to appropriate dashboard
//           if (userRole === 'Main Administrator') {
//             navigate('/super-admin');
//           } else if (userRole === 'Regional Admin') {
//             navigate('/admin-dashboard');
//           } else {
//             navigate('/dashboard');
//           }
//         }
//       } catch (error) {
//         console.error('Role check error:', error);
//         navigate('/');
//       } finally {
//         setChecking(false);
//       }
//     };

//     if (currentAccount) {
//       checkRole();
//     }
//   }, [currentAccount, navigate]);

//   if (checking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return authorized ? children : null;
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Landing />} />
//       <Route path="/registration" element={<Registration />} />
//       <Route path="/pending-verification" element={<PendingVerification />} />

//       {/* Protected Routes - Super Admin Only */}
//       <Route
//         path="/super-admin"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['Main Administrator']}>
//               <MainAdminDashboard />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       {/* Protected Routes - Regional Admin Only */}
//       <Route
//         path="/admin-dashboard"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['Regional Admin']}>
//               <AdminDashboard />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       {/* Protected Routes - Citizens (Users) */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['User']}>
//               <UserDashboard />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/properties"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['User']}>
//               <Properties />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/add-property"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['User']}>
//               <AddProperty />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/requests"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['User']}>
//               <Requests />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/requested"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['User']}>
//               <Requested />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/explore"
//         element={
//           <ProtectedRoute>
//             <RoleRoute allowedRoles={['User']}>
//               <Explore />
//             </RoleRoute>
//           </ProtectedRoute>
//         }
//       />

//       {/* Catch all - redirect to home */}
//       {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
//     </Routes>
//   );
// }

// function App() {
  
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   )
// }

// export default App