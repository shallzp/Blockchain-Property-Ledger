import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import UserDashboard from './pages/UserDashboard';
import Registration from './pages/Registration';
import MainAdminDashboard from './pages/MainAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Properties from './pages/Properties';
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
        <Route path="/requests" element={ <Requests/> }/>
        <Route path="/requested" element={ <Requested/> }/>
        <Route path="/explore" element={ <Explore/> }/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App