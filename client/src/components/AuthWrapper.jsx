// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useWeb3 } from "../context/Web3Context";
// import { useUserRegistry } from "../hooks/useUserRegistry";
// import PendingVerification from './PendingVerification'; 

// export const MAIN_ADMIN_ADDRESS = '0xE312CEB836FCd0903a1b303D2f3B01853FE4D401'; // your admin address

// const AuthWrapper = ({ children }) => {
//   const navigate = useNavigate();
//   const { isConnected, currentAccount } = useWeb3();
//   const { contracts, getUserDetails, isUserVerified } = useUserRegistry(); // <-- contracts included here
//   const [loading, setLoading] = useState(true);
//   const [showPendingPopup, setShowPendingPopup] = useState(false);

//   // Registration check using contract directly for maximum reliability
//   const isUserRegistered = async address => {
//     if (!contracts?.userRegistry) return false;
//     return await contracts.userRegistry.methods.registeredUsers(address).call();
//   };

//   useEffect(() => {
//     const checkAuthFlow = async () => {
//       // Ensure contract loaded
//       if (!contracts?.userRegistry) {
//         setLoading(true);
//         return;
//       }
//       if (!isConnected || !currentAccount) {
//         setLoading(false);
//         return;
//       }
//       const wallet = currentAccount.toLowerCase();
//       const mainAdmin = MAIN_ADMIN_ADDRESS.toLowerCase();

//       if (wallet === mainAdmin) {
//         navigate("/main/dashboard");
//         setLoading(false);
//         return;
//       }

//       try {
//         const registered = await isUserRegistered(wallet);
//         if (!registered) {
//           navigate("/register");
//           setLoading(false);
//           return;
//         }
//         const verified = await isUserVerified(wallet);
//         if (!verified) {
//           setShowPendingPopup(true);
//           setLoading(false);
//           return;
//         }
//         const userDetails = await getUserDetails(wallet);
//         // role string should match what you return from contract (case-sensitive!)
//         if (userDetails.role === "Regional Admin") {
//           navigate("/admin/dashboard");
//         } else {
//           navigate("/user/dashboard");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Auth flow error:", error);
//         setLoading(false);
//       }
//     };

//     checkAuthFlow();

//     // Trigger whenever context, connection, or contract changes
//   }, [isConnected, currentAccount, contracts, getUserDetails, isUserVerified, navigate]);

//   if (loading) {
//     // optional: show loading indicator
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {showPendingPopup && (
//         <PendingVerification onClose={() => setShowPendingPopup(false)} />
//       )}
//       {children}
//     </>
//   );
// };

// export default AuthWrapper;

// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Home, User, FileText, Eye, Send, Search } from "lucide-react";
// import PendingVerification from "./PendingVerification";
// import { useWeb3 } from "../context/Web3Context";
// import { useUserRegistry } from "../hooks/useUserRegistry";

// // Nav config for each role
// const userNavItems = [
//   { to: "/user/dashboard", label: "Home", icon: Home },
//   { to: "/profile", label: "Profile", icon: User },
//   { to: "/user/properties", label: "Properties", icon: FileText },
//   { to: "/user/requests", label: "Requests", icon: Eye },
//   { to: "/user/requested", label: "Requested", icon: Send },
//   { to: "/user/explore", label: "Explore", icon: Search }
// ];

// const adminNavItems = [
//   { to: "/admin/dashboard", label: "Home", icon: Home },
//   { to: "/profile", label: "Profile", icon: User },
//   { to: "/admin/verify-users", label: "Verify Users", icon: Eye },
//   { to: "/admin/verify-property", label: "Verify Properties", icon: FileText }
// ];

// const mainAdminNavItems = [
//   { to: "/main/dashboard", label: "Home", icon: Home },
//   { to: "/profile", label: "Profile", icon: User },
//   { to: "/main/monitor", label: "Audit & Monitor", icon: Eye },
//   { to: "/main/manage-admin", label: "Manage Admins", icon: Send }
// ];

// // Create nav context
// const NavContext = createContext([]);
// export const useNavItems = () => useContext(NavContext);

// export const MAIN_ADMIN_ADDRESS = '0xE312CEB836FCd0903a1b303D2f3B01853FE4D401'; // your admin address

// const AuthWrapper = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();  // Add this to get current path
//   const { isConnected, currentAccount } = useWeb3();
//   const { contracts, getUserDetails, isUserVerified } = useUserRegistry();
//   const [navItems, setNavItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showPendingPopup, setShowPendingPopup] = useState(false);

//   // Registration check using contract directly
//   const isUserRegistered = async address => {
//     if (!contracts?.userRegistry) return false;
//     return await contracts.userRegistry.methods.registeredUsers(address).call();
//   };

//   useEffect(() => {
//     const checkAuthFlow = async () => {
//       if (!contracts?.userRegistry) {
//         setLoading(true);
//         return;
//       }
//       if (!isConnected || !currentAccount) {
//         setNavItems([]);
//         setLoading(false);
//         return;
//       }
//       const wallet = currentAccount.toLowerCase();
//       const mainAdmin = MAIN_ADMIN_ADDRESS.toLowerCase();

//       if (wallet === mainAdmin) {
//         setNavItems(mainAdminNavItems);
//         setLoading(false);

//         if (!location.pathname.startsWith("/main/") || location.pathname === "/profile") || location.pathname === "/" || location.pathname === "/login") {
//           navigate("/main/dashboard");
//         }
//         return;  // early return after main admin logic
//       } else {
//         try {
//           const registered = await isUserRegistered(wallet);
//           if (!registered) {
//             setNavItems([]);
//             setLoading(false);
//             navigate("/register");
//             return;
//           }
//           const verified = await isUserVerified(wallet);
//           if (!verified) {
//             setNavItems([]);
//             setLoading(false);
//             setShowPendingPopup(true);
//             return;
//           }
//           const userDetails = await getUserDetails(wallet);

//           // Match role strings exactly as returned from contract
//           if (userDetails.role === "RegionalAdmin") {  // No space? Check contract for exact string
//             setNavItems(adminNavItems);
//             setLoading(false);

//             if (!location.pathname.startsWith("/admin/") || location.pathname === "/profile") || location.pathname === "/" || location.pathname === "/login") {
//               navigate("/admin/dashboard");
//             }
//           } else if (userDetails.role === "User") {
//             setNavItems(userNavItems);
//             setLoading(false);

//             if (!location.pathname.startsWith("/user/") || location.pathname === "/profile") || location.pathname === "/" || location.pathname === "/login") {
//               navigate("/user/dashboard");
//             }
//           } else {
//             setNavItems([]);
//             setLoading(false);
//           }
//         } catch (error) {
//           setLoading(false);
//           setNavItems([]);
//           console.error("AuthWrapper error:", error);
//         }
//       }
//     };
//     checkAuthFlow();
//   }, [isConnected, currentAccount, contracts, getUserDetails, isUserVerified, navigate, location]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <NavContext.Provider value={navItems}>
//       {showPendingPopup && <PendingVerification onClose={() => setShowPendingPopup(false)} />}
//       {children}
//     </NavContext.Provider>
//   );
// };

// export default AuthWrapper;

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, FileText, Eye, Send, Search } from "lucide-react";
import PendingVerification from "./PendingVerification";
import { useWeb3 } from "../context/Web3Context";
import { useUserRegistry } from "../hooks/useUserRegistry";

// Nav config for each role
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
  { to: "/admin/verify-users", label: "Verify Users", icon: Eye },
  { to: "/admin/verify-property", label: "Verify Properties", icon: FileText }
];

const mainAdminNavItems = [
  { to: "/main/dashboard", label: "Home", icon: Home },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/main/monitor", label: "Audit & Monitor", icon: Eye },
  { to: "/main/manage-admin", label: "Manage Admins", icon: Send }
];

// Create nav context
const NavContext = createContext([]);
export const useNavItems = () => useContext(NavContext);

export const MAIN_ADMIN_ADDRESS = '0xE312CEB836FCd0903a1b303D2f3B01853FE4D401';

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, currentAccount } = useWeb3();
  const { contracts, getUserDetails, isUserVerified } = useUserRegistry();
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPendingPopup, setShowPendingPopup] = useState(false);

  // Registration check using contract directly
  const isUserRegistered = async address => {
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
      const mainAdmin = MAIN_ADMIN_ADDRESS.toLowerCase();

      // Only redirect from public paths!
      const publicPaths = ["/", "/login", "/register"];

      if (wallet === mainAdmin) {
        setNavItems(mainAdminNavItems);
        setLoading(false);

        if (publicPaths.includes(location.pathname)) {
          navigate("/main/dashboard");
        }
        return;
      } else {
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

          if (userDetails.role === "RegionalAdmin") { // Use exact string from your contract
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
          setLoading(false);
          setNavItems([]);
          console.error("AuthWrapper error:", error);
        }
      }
    };
    checkAuthFlow();
  }, [isConnected, currentAccount, contracts, getUserDetails, isUserVerified, navigate, location]);

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