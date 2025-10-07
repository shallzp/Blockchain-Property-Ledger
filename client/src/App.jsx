import { Web3 } from 'web3';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import CitizenDashboard from './pages/CitizenDashboard';

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
