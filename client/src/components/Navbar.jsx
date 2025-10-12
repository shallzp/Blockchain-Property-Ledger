import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, User, FileText, Send, Eye, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const Navbar = ({ userRole, walletAdd, navItems }) => {
  const navigate = useNavigate();
  const { disconnectWallet, balance, chainName } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  const baseStyle = "px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2 rounded-lg hover:bg-orange-50";
  const activeStyle = "px-4 py-2 bg-orange-500 text-white rounded-lg font-medium shadow-sm flex items-center gap-2";

  // Use navigation items passed via props
  const navigationItems = navItems || [];

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    if (address.length <= 13) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/user/dashboard')}>
        <img src="./Logo.png" alt="PropChain Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">PropChain</span>
      </div>
      
      {/* Navigation Links */}
      <div className="flex items-center gap-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => (isActive ? activeStyle : baseStyle)}
            >
              <IconComponent className="w-4 h-4" /> {item.label}
            </NavLink>
          );
        })}
      </div>
    
      {/* Right Section - User Info */}
      <div className="flex items-center gap-3">
        {/* User Role Badge */}
        <div className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
          {userRole || 'User'}
        </div>

        {/* Wallet Info Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium font-mono">
              {formatAddress(walletAdd)}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
              {/* Wallet Details */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                <p className="text-sm font-mono text-gray-900 break-all">{walletAdd}</p>
              </div>

              {/* Balance */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Balance</span>
                  <span className="text-sm font-bold text-gray-900">{balance || '0.0000'} ETH</span>
                </div>
              </div>

              {/* Network */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Network</span>
                  <span className="text-sm font-medium text-gray-900">{chainName || 'Unknown'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-2 py-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(walletAdd);
                    setShowDropdown(false);
                    alert('Address copied to clipboard!');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Copy Address
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleDisconnect();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;