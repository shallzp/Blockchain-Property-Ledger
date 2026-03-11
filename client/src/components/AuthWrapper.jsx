/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { User, FileText, Eye, Send, Search } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
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

const roleConfig = {
  "User": {
    navItems: userNavItems,
    homePath: "/user/dashboard",
    allowedPrefix: "/user",
  },
  "Regional Admin": {
    navItems: adminNavItems,
    homePath: "/admin/dashboard",
    allowedPrefix: "/admin",
  },
  "Main Administrator": {
    navItems: mainAdminNavItems,
    homePath: "/main/dashboard",
    allowedPrefix: "/main",
  },
};

const AuthWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, currentAccount } = useWeb3();
  const { contracts, getUserDetails, isUserVerified } = useUserRegistry();

  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthFlow = async () => {
      if (!isConnected || !currentAccount) {
        setNavItems([]);
        setLoading(false);
        navigate("/", { replace: true });
        return;
      }

      if (!contracts?.userRegistry) {
        setLoading(true);
        return;
      }

      const wallet = currentAccount.toLowerCase();

      try {
        const registered = await contracts.userRegistry.methods.registeredUsers(wallet).call();
        if (!registered) {
          setNavItems([]);
          setLoading(false);
          navigate("/register", { replace: true });
          return;
        }

        const userDetails = await getUserDetails(wallet);
        const config = roleConfig[userDetails.role];
        if (!config) {
          setNavItems([]);
          setLoading(false);
          navigate("/", { replace: true });
          return;
        }

        // Keep compatibility for older bookmarks/links.
        const legacyAliases = {
          "/dashboard": config.homePath,
          "/properties": "/user/properties",
          "/add-property": "/user/add-property",
          "/requests": "/user/requests",
          "/requested": "/user/requested",
          "/explore": "/user/explore",
        };
        if (legacyAliases[location.pathname]) {
          setNavItems(config.navItems);
          setLoading(false);
          navigate(legacyAliases[location.pathname], { replace: true });
          return;
        }

        const verified = await isUserVerified(wallet);

        setNavItems(config.navItems);

        // Pending users can only access the dedicated pending page.
        if (!verified) {
          setNavItems([]);
          setLoading(false);
          if (location.pathname !== "/pending-verification") {
            navigate("/pending-verification", { replace: true });
          }
          return;
        }

        if (location.pathname === "/pending-verification") {
          setLoading(false);
          navigate(config.homePath, { replace: true });
          return;
        }

        const isProfilePath = location.pathname === "/profile";
        const isRolePath = location.pathname.startsWith(config.allowedPrefix);
        if (!isProfilePath && !isRolePath) {
          setLoading(false);
          navigate(config.homePath, { replace: true });
          return;
        }

        setLoading(false);
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
    location.pathname,
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
      <Outlet />
    </NavContext.Provider>
  );
};

export default AuthWrapper;
