import { Web3 } from 'web3';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import CitizenDashboard from './pages/CitizenDashboard';
import Registration from './pages/Registration';

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

        <Route path="/register" element={
          <Registration></Registration>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App