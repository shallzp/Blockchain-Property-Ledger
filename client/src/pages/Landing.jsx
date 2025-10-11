import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Home, Shield, Users, FileCheck, TrendingUp, Lock } from 'lucide-react';

import { useWeb3 } from '../context/Web3Context';

const Landing = () => {
  // Get Web3 context values
  const { isConnected, currentAccount, connectWallet } = useWeb3();
  
  // React Router navigation hook
  const navigate = useNavigate();

  // Format wallet address to show first 6 and last 4 characters
  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  
  // Redirect to dashboard if wallet is connected
  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Fixed at top */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-2">
              <img src="./Logo.png" alt="PropChain Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-white">PropChain</span>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium shadow-lg">
                {formatAddress(currentAccount)}
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition shadow-lg shadow-orange-500/30"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative min-h-screen flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-orange-900/80 z-10"></div>
            <img 
              src="./assets/backdrop.jpg" 
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-8 py-32 w-full">
            <div className="max-w-4xl">
              <h1 className="text-7xl md:text-8xl font-bold mb-8">
                <span className="text-white">THE </span>
                <span className="text-white italic font-light">BLOCKCHAIN</span>
                <br />
                <span className="text-white">OF PROPERTY</span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-12 max-w-2xl leading-relaxed">
                PropChain is a decentralized network for transparent, secure, and immutable property registration on the Ethereum blockchain. Revolutionizing real estate with trustless ownership verification and instant transfer capabilities.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/explore')}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition shadow-xl text-lg"
                >
                  Explore Properties
                </button>
                <button 
                  onClick={() => navigate('/registration')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition backdrop-blur-sm border border-white/20 text-lg"
                >
                  Register Land
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Zigzag Border */}
        <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden">
          <svg className="w-full h-24" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path 
              d="M0,0 L50,50 L100,0 L150,50 L200,0 L250,50 L300,0 L350,50 L400,0 L450,50 L500,0 L550,50 L600,0 L650,50 L700,0 L750,50 L800,0 L850,50 L900,0 L950,50 L1000,0 L1050,50 L1100,0 L1150,50 L1200,0 L1200,100 L0,100 Z" 
              fill="white" 
            />
          </svg>
        </div>

        {/* Statistics Panel */}
        <div className="relative z-40 max-w-7xl mx-auto px-8 -mt-32">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-6 font-semibold">
              THE MOST POWERFUL DECENTRALIZED PROPERTY REGISTRY
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Statistic Cards */}
              {[
                { value: '0+', label: 'Verified Properties' },
                { value: '0M', label: 'Total Transactions' },
                { value: '0K', label: 'Registered Users' },
                { value: '0+', label: 'Regional Admins' }
              ].map((stat, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-500 transition">
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Secure. Transparent. Decentralized.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of property registration with blockchain technology ensuring immutable records and instant verification.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Immutable Records',
                description: 'All property records are stored on the Ethereum blockchain, ensuring permanent and tamper-proof ownership history that cannot be altered or disputed.'
              },
              {
                icon: Users,
                title: 'Multi-Role Access',
                description: 'Four distinct user roles including Super Admin, Local Admin, Land Owners, and Buyers ensure proper authorization and verification at every step.'
              },
              {
                icon: FileCheck,
                title: 'Instant Verification',
                description: 'KYC validation and document verification ensure only legitimate users can participate, while smart contracts enable instant ownership transfers.'
              },
              {
                icon: TrendingUp,
                title: 'Transparent Trading',
                description: 'Property owners can mark land for sale, receive purchase requests, and complete transactions with full transparency and secure escrow mechanisms.'
              },
              {
                icon: Lock,
                title: 'Fraud Prevention',
                description: 'Super Admin oversight with the ability to freeze suspicious transactions and audit complete ownership history prevents fraudulent activity.'
              },
              {
                icon: Home,
                title: 'Public Registry',
                description: 'All verified property listings are publicly accessible, allowing anyone to explore available properties and verify ownership claims transparently.'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-8 rounded-2xl bg-gray-50 hover:bg-orange-50 transition border border-gray-100 hover:border-orange-200"
                >
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition">
                    <Icon className="w-7 h-7 text-orange-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;