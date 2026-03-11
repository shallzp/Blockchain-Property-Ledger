import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';

import Registration from './pages/Registration';

import Profile from './pages/Profile';

import UserDashboard from './pages/UserDashboard';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import Requests from './pages/Requests';
import Requested from './pages/Requested';
import Explore from './pages/Explore';

import MainAdminDashboard from './pages/MainAdminDashboard';
import ManageAdmin from './pages/ManageAdmin';
import AuditMonitor from './pages/AuditMonitor';

import AdminDashboard from './pages/AdminDashboard';
import VerifyProperty from './pages/VerifyProperty';
import VerifyUsers from './pages/VerifyUsers';

import AuthWrapper from './components/AuthWrapper';
import PendingVerification from './components/PendingVerification';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing/>} />
        <Route path="/register" element={<Registration/>} />

        {/* Protected routes wrapped by AuthWrapper */}
        <Route element={<AuthWrapper />}>
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/profile" element={<Profile/>} />

          {/* User routes */}
          <Route path="/user/dashboard" element={<UserDashboard/>} />
          <Route path="/user/properties" element={<Properties/>} />
          <Route path="/user/add-property" element={<AddProperty/>} />
          <Route path="/user/requests" element={<Requests/>} />
          <Route path="/user/requested" element={<Requested/>} />
          <Route path="/user/explore" element={<Explore/>} />

          {/* Main Admin routes */}
          <Route path="/main/dashboard" element={<MainAdminDashboard/>} />
          <Route path="/main/manage-admin" element={<ManageAdmin/>} />
          <Route path="/main/monitor" element={<AuditMonitor/>} />

          {/* Regional Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/verify-property" element={<VerifyProperty/>} />
          <Route path="/admin/verify-users" element={<VerifyUsers/>} />

          {/* Legacy aliases */}
          <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
          <Route path="/properties" element={<Navigate to="/user/properties" replace />} />
          <Route path="/add-property" element={<Navigate to="/user/add-property" replace />} />
          <Route path="/requests" element={<Navigate to="/user/requests" replace />} />
          <Route path="/requested" element={<Navigate to="/user/requested" replace />} />
          <Route path="/explore" element={<Navigate to="/user/explore" replace />} />
          <Route path="/property/:propertyId" element={<Navigate to="/user/properties" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
