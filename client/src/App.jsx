import { Web3 } from 'web3';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import CitizenDashboard from './pages/CitizenDashboard';
import Registration from './pages/Registration';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ 
          <Landing></Landing>
        } />

        <Route path="/dashboard" element={ 
          <CitizenDashboard></CitizenDashboard>
        } />

        <Route path="/super" element={
          <SuperAdminDashboard></SuperAdminDashboard>
        } />

        <Route path="/admin" element={
          <AdminDashboard></AdminDashboard>
        } />

        <Route path="/register" element={
          <Registration></Registration>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App