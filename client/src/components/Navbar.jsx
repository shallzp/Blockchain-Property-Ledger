import { NavLink } from 'react-router-dom';
import { Home, Search, User, FileText, Send, Eye } from 'lucide-react';


const Navbar = ( props ) => {

  const baseStyle = "px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2 rounded-lg";
  const activeStyle = "px-4 py-2 bg-orange-500 text-white rounded-lg font-medium shadow-sm flex items-center gap-2";

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <img src="../Logo.png" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">PropChain</span>
      </div>
      
      <div className="flex items-center gap-4">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
          <Home className="w-4 h-4" /> Home
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
          <User className="w-4 h-4" /> Profile
        </NavLink>

        <NavLink to="/properties" className={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
          <FileText className="w-4 h-4" /> Properties
        </NavLink>

        <NavLink to="/requests" className={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
          <Eye className="w-4 h-4" /> Requests
        </NavLink>

        <NavLink to="/requested" className={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
          <Send className="w-4 h-4" /> Requested
        </NavLink>

        <NavLink to="/explore" className={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
          <Search className="w-4 h-4" /> Explore
        </NavLink>
      </div>
    
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
          {props.userRole}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{props.walletAdd}</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
