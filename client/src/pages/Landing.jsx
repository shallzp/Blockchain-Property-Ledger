import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Home, Shield, Users, FileCheck, TrendingUp, Lock } from 'lucide-react';

import { useWeb3 } from '../context/Web3Context';
import { useUserRegistry } from '../hooks/useUserRegistry';
import { usePropertyRegistry } from '../hooks/usePropertyRegistry';

const INITIAL_STATS = {
  verifiedProperties: 0,
  activeListings: 0,
  registeredUsers: 0,
  regionalAdmins: 0,
};

const formatCount = (value) => new Intl.NumberFormat('en-IN').format(value);

const Landing = () => {
  const { isConnected, currentAccount, connectWallet, contracts } = useWeb3();
  const { getUserDetails, getTotalUsers, getRegionalAdminCount } = useUserRegistry();
  const { getVerifiedProperties, getOnSalePropertiesCount } = usePropertyRegistry();
  const navigate = useNavigate();

  const [stats, setStats] = useState(INITIAL_STATS);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (!isConnected || !currentAccount || !contracts.userRegistry) {
        return;
      }

      try {
        const userDetails = await getUserDetails(currentAccount);

        if (userDetails.role === "Main Administrator") {
          navigate("/main/dashboard");
        } else if (userDetails.role === "Regional Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } catch (err) {
        console.error('Failed to get user details in landing redirect:', err);
        navigate("/user/dashboard");
      }
    };

    redirectBasedOnRole();
  }, [isConnected, currentAccount, contracts.userRegistry, getUserDetails, navigate]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchStats = async () => {
      if (!contracts.userRegistry || !contracts.propertyRegistry) {
        if (isMounted) {
          setStatsLoading(true);
        }
        return;
      }

      try {
        if (isMounted) {
          setStatsError('');
        }

        const [verifiedProperties, activeListings, registeredUsers, regionalAdmins] = await Promise.all([
          getVerifiedProperties(),
          getOnSalePropertiesCount(),
          getTotalUsers(),
          getRegionalAdminCount(),
        ]);

        if (!isMounted) {
          return;
        }

        setStats({
          verifiedProperties: verifiedProperties.length,
          activeListings: Number(activeListings),
          registeredUsers: Number(registeredUsers),
          regionalAdmins: Number(regionalAdmins),
        });
        setStatsLoading(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load landing statistics:', error);
        setStatsLoading(false);
        setStatsError('Live statistics are temporarily unavailable.');
      }
    };

    fetchStats();

    if (contracts.userRegistry && contracts.propertyRegistry) {
      intervalId = window.setInterval(fetchStats, 15000);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [
    contracts.userRegistry,
    contracts.propertyRegistry,
    getOnSalePropertiesCount,
    getRegionalAdminCount,
    getTotalUsers,
    getVerifiedProperties,
  ]);

  const statistics = [
    { value: stats.verifiedProperties, label: 'Verified Properties' },
    { value: stats.activeListings, label: 'Active Listings' },
    { value: stats.registeredUsers, label: 'Registered Users' },
    { value: stats.regionalAdmins, label: 'Regional Admins' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-2">
              <img src="./Logo.png" alt="PropChain Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold">PropChain</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={connectWallet}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition shadow-lg shadow-orange-500/30"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      <div className="relative">
        <div className="mx-28 relative max-h-screen flex items-center w-8/9">
          <div className="absolute inset-0 z-0">
            <div className="rounded-2xl absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-orange-900/80 z-10"></div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-8 pt-12 pb-32 w-full">
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
            </div>
          </div>
        </div>

        <div className="relative z-40 max-w-7xl mx-auto px-8 -mt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
                Live Platform Statistics
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat) => (
                <div key={stat.label} className="group cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-4xl font-bold text-gray-900">
                      {statsLoading ? '--' : formatCount(stat.value)}
                    </h3>
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

            {statsError && (
              <p className="mt-4 text-sm text-red-600">{statsError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Secure. Transparent. Decentralized.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of property registration with blockchain technology ensuring immutable records and instant verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Immutable Records',
                description: 'All property records are stored on the Ethereum blockchain, ensuring permanent and tamper-proof ownership history that cannot be altered or disputed.',
              },
              {
                icon: Users,
                title: 'Multi-Role Access',
                description: 'Four distinct user roles including Super Admin, Local Admin, Land Owners, and Buyers ensure proper authorization and verification at every step.',
              },
              {
                icon: FileCheck,
                title: 'Instant Verification',
                description: 'KYC validation and document verification ensure only legitimate users can participate, while smart contracts enable instant ownership transfers.',
              },
              {
                icon: TrendingUp,
                title: 'Transparent Trading',
                description: 'Property owners can mark land for sale, receive purchase requests, and complete transactions with full transparency and secure escrow mechanisms.',
              },
              {
                icon: Lock,
                title: 'Fraud Prevention',
                description: 'Super Admin oversight with the ability to freeze suspicious transactions and audit complete ownership history prevents fraudulent activity.',
              },
              {
                icon: Home,
                title: 'Public Registry',
                description: 'All verified property listings are publicly accessible, allowing anyone to explore available properties and verify ownership claims transparently.',
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group p-8 rounded-2xl bg-gray-50 hover:bg-orange-50 transition border border-gray-100 hover:border-orange-200">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition">
                    <Icon className="w-7 h-7 text-orange-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
