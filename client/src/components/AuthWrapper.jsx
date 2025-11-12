import { createContext, useContext, useEffect, useState } from "react";
import { Home, User, FileText, Eye, Send, Search } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import PendingVerification from "./PendingVerification";
import { useWeb3 } from "../context/Web3Context";
import { useUserRegistry } from "../hooks/useUserRegistry";

const NavContext = createContext([]);

export const useNavItems = () => useContext(NavContext);

const userNavItems = [
  { to: "/user/dashboard", label: "Home", icon: User },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/user/properties", label: "Properties", icon: FileText },
  { to: "/user/requests", label: "Requests", icon: Eye },
  { to: "/user/requested", label: "Requested", icon: Send },
  { to: "/user/explore", label: "Explore", icon: Search },
];

const adminNavItems = [
  { to: "/admin/dashboard", label: "Home", icon: User },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin/verify-users", label: "Verify Users", icon: Eye },
  { to: "/admin/verify-property", label: "Verify Properties", icon: FileText },
];

const mainAdminNavItems = [
  { to: "/main/dashboard", label: "Home", icon: User },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/main/monitor", label: "Audit & Monitor", icon: Eye },
  { to: "/main/manage-admin", label: "Manage Admins", icon: Send },
];

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, currentAccount } = useWeb3();
  const { contracts, getUserDetails, isUserVerified } = useUserRegistry();

  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPendingPopup, setShowPendingPopup] = useState(false);

  const isUserRegistered = async (address) => {
    if (!contracts?.userRegistry) return false;
    return await contracts.userRegistry.methods.registeredUsers(address).call();
  };

  useEffect(() => {
    const checkAuthFlow = async () => {
      if (!contracts?.userRegistry) {
        setLoading(true);
        return;
      }
      if (!isConnected || !currentAccount) {
        setNavItems([]);
        setLoading(false);
        return;
      }

      const wallet = currentAccount.toLowerCase();
      const publicPaths = ["/", "/login", "/register"];

      try {
        const registered = await isUserRegistered(wallet);
        if (!registered) {
          setNavItems([]);
          setLoading(false);
          navigate("/register");
          return;
        }
        const verified = await isUserVerified(wallet);
        if (!verified) {
          setNavItems([]);
          setLoading(false);
          setShowPendingPopup(true);
          return;
        }
        const userDetails = await getUserDetails(wallet);

        if (userDetails.role === "Main Administrator") {
          setNavItems(mainAdminNavItems);
          setLoading(false);
          if (publicPaths.includes(location.pathname)) {
            navigate("/main/dashboard");
          }
        } else if (userDetails.role === "Regional Admin") {
          setNavItems(adminNavItems);
          setLoading(false);
          if (publicPaths.includes(location.pathname)) {
            navigate("/admin/dashboard");
          }
        } else if (userDetails.role === "User") {
          setNavItems(userNavItems);
          setLoading(false);
          if (publicPaths.includes(location.pathname)) {
            navigate("/user/dashboard");
          }
        } else {
          setNavItems([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("AuthWrapper error:", error);
        setLoading(false);
        setNavItems([]);
      }
    };

    checkAuthFlow();
  }, [
    isConnected,
    currentAccount,
    contracts,
    getUserDetails,
    isUserVerified,
    navigate,
    location,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <NavContext.Provider value={navItems}>
      {showPendingPopup && (
        <PendingVerification onClose={() => setShowPendingPopup(false)} />
      )}
      {children}
    </NavContext.Provider>
  );
};

export default AuthWrapper;