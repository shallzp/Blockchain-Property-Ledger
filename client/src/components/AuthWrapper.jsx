import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, FileText, Eye, Send, Search } from "lucide-react";
import PendingVerification from "./PendingVerification"; // Your modal
import { useWeb3 } from "../context/Web3Context";
import { useUserRegistry } from "../hooks/useUserRegistry";

// Nav items for each role
const userNavItems = [
  { to: "/user/dashboard", label: "Home", icon: Home },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/user/properties", label: "Properties", icon: FileText },
  { to: "/user/requests", label: "Requests", icon: Eye },
  { to: "/user/requested", label: "Requested", icon: Send },
  { to: "/user/explore", label: "Explore", icon: Search }
];

const adminNavItems = [
  { to: "/admin/dashboard", label: "Home", icon: Home },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin/verify-users", label: "Verify Users", icon: Eye }, // example icon
  { to: "/admin/verify-property", label: "Verify Properties", icon: FileText }
];

const mainAdminNavItems = [
  { to: "/main/dashboard", label: "Home", icon: Home },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/main/monitor", label: "Audit & Monitor", icon: Eye }, // example icon
  { to: "/main/manage-admin", label: "Manage Admins", icon: Send }
];

// Create context to provide navItems
const NavContext = createContext([]);

export const useNavItems = () => useContext(NavContext);

const MAIN_ADMIN_ADDRESS = '0xyourmainadminaddress'.toLowerCase(); // Replace with your admin address

export const AuthWrapper = ({ children }) => {
  const { isConnected, currentAccount } = useWeb3();
  const { isUserRegistered, getUserDetails, isUserVerified } = useUserRegistry();
  const navigate = useNavigate();

  const [navItems, setNavItems] = useState([]);
  const [showPendingPopup, setShowPendingPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!isConnected || !currentAccount) {
        setNavItems([]);
        setLoading(false);
        // stay on landing or whatever page user currently is
        return;
      }

      if (currentAccount.toLowerCase() === MAIN_ADMIN_ADDRESS) {
        setNavItems(mainAdminNavItems);
        setUserRole('Main Administrator');
        setLoading(false);
        navigate('/main/dashboard');
        return;
      }

      try {
        const registered = await isUserRegistered(currentAccount);
        if (!registered) {
          setNavItems([]);
          setLoading(false);
          navigate('/register');
          return;
        }

        const verified = await isUserVerified(currentAccount);
        if (verified) {
          const userDetails = await getUserDetails(currentAccount);
          setUserRole(userDetails.role);

          if (userDetails.role === 'Regional Admin') {
            setNavItems(adminNavItems);
            navigate('/admin/dashboard');
          } else {
            setNavItems(userNavItems);
            navigate('/user/dashboard');
          }
          setLoading(false);
        } else {
          setLoading(false);
          setShowPendingPopup(true);
        }
      } catch (err) {
        setLoading(false);
        console.error('AuthWrapper error:', err);
      }
    };

    checkUserStatus();
  }, [isConnected, currentAccount, isUserRegistered, getUserDetails, isUserVerified, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <NavContext.Provider value={navItems}>
      {showPendingPopup && <PendingVerification onClose={() => setShowPendingPopup(false)} />}
      {children}
    </NavContext.Provider>
  );
};