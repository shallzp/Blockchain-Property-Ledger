import { Home, Search, MapPin, Bed, Bath, Maximize, ChevronRight, Calendar, Star, User, FileText, Send, Eye } from 'lucide-react';


const Navbar = ( props ) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <img src="../Logo.png" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">LandChain</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium shadow-sm">
          <Home className="inline w-4 h-4 mr-1" /> Home
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2">
          <User className="w-4 h-4" /> Profile
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2">
          <FileText className="w-4 h-4" /> Properties
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2">
          <Send className="w-4 h-4" /> Requests
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2">
          <Eye className="w-4 h-4" /> Requested
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-orange-500 transition flex items-center gap-2">
          <Search className="w-4 h-4" /> Explore
        </button>
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
