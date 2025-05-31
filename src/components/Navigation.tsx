import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Calendar, ClipboardList, Clock, LogOut, Menu, Pill, User, Wallet, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Use useEffect to handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Lock body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when mobile menu is closed
      document.body.style.overflow = '';
    }
    
    // Cleanup function to restore body scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  // Handle clicks outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      const mobileMenu = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (mobileMenu && menuButton && target instanceof Element) {
        if (!mobileMenu.contains(target) && !menuButton.contains(target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Mobile Backdrop - Fixed positioning issue */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[98] md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile top navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white h-16 shadow-sm z-[101] px-4 flex items-center justify-between md:hidden">
        <button 
          id="mobile-menu-button"
          onClick={toggleMobileMenu} 
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">M</div>
          <span className="ml-2 font-medium">MediCare</span>
        </div>
        
        <button 
          onClick={() => handleNavigation('/profile')}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <User size={16} />
        </button>
      </header>
      
      {/* Mobile Sidebar - Fixed z-index and positioning */}
      <div 
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden transition-transform duration-300 ease-in-out z-[99] w-[280px]`}
      >
        <div className="bg-white h-full shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">M</div>
              <span className="ml-2 font-medium text-lg">MediCare</span>
            </div>
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close mobile menu"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-2 overflow-y-auto flex-1">
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => handleNavigation('/profile')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/profile') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <User size={20} className="mr-3" />
                <span className="font-medium">Profile</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/schedule')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/schedule') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Calendar size={20} className="mr-3" />
                <span className="font-medium">Schedule</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/medications')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/medications') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Pill size={20} className="mr-3" />
                <span className="font-medium">Medications</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/follow-ups')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/follow-ups') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <ClipboardList size={20} className="mr-3" />
                <span className="font-medium">Follow-ups</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/progress')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/progress') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Activity size={20} className="mr-3" />
                <span className="font-medium">Progress</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/patient-report')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/patient-report') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <ClipboardList size={20} className="mr-3" />
                <span className="font-medium">Patient Report</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/payments')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/payments') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Wallet size={20} className="mr-3" />
                <span className="font-medium">Payments</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/timeline')}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/timeline') 
                    ? 'bg-primary-light text-primary' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Clock size={20} className="mr-3" />
                <span className="font-medium">Timeline</span>
              </button>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut size={20} className="mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-gray-200 pt-8 z-30 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`}>M</div>
            {!isSidebarCollapsed && <span className="font-medium text-lg">MediCare</span>}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="px-2 flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => navigate('/profile')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/profile') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <User size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Profile</span>}
            </button>
            <button 
              onClick={() => navigate('/schedule')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/schedule') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Calendar size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Schedule</span>}
            </button>
            <button 
              onClick={() => navigate('/medications')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/medications') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Pill size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Medications</span>}
            </button>
            <button 
              onClick={() => navigate('/follow-ups')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/follow-ups') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <ClipboardList size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Follow-ups</span>}
            </button>
            <button 
              onClick={() => navigate('/progress')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/progress') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Activity size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Progress</span>}
            </button>
            <button 
              onClick={() => navigate('/patient-report')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/patient-report') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <ClipboardList size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Patient Report</span>}
            </button>
            <button 
              onClick={() => navigate('/payments')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/payments') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Wallet size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Payments</span>}
            </button>
            <button 
              onClick={() => navigate('/timeline')}
              className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/timeline') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Clock size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Timeline</span>}
            </button>
          </nav>
        </div>
        
        <div className="px-2 pb-4 border-t border-gray-100 mt-4">
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <div className="w-6 flex justify-center">
              <LogOut size={20} />
            </div>
            {!isSidebarCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Bottom mobile navigation - Enhanced with better touch targets */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-40 md:hidden">
        <button 
          onClick={() => handleNavigation('/profile')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-0 flex-1 transition-colors ${
            isActive('/profile') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <User size={20} />
          <span className="text-xs font-medium">Profile</span>
        </button>
        <button 
          onClick={() => handleNavigation('/schedule')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-0 flex-1 transition-colors ${
            isActive('/schedule') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Calendar size={20} />
          <span className="text-xs font-medium">Schedule</span>
        </button>
        
        <button 
          onClick={() => handleNavigation('/medications')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-0 flex-1 transition-colors ${
            isActive('/medications') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Pill size={20} />
          <span className="text-xs font-medium">Meds</span>
        </button>
        
        <button 
          onClick={() => handleNavigation('/follow-ups')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-0 flex-1 transition-colors ${
            isActive('/follow-ups') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <ClipboardList size={20} />
          <span className="text-xs font-medium">Follow-ups</span>
        </button>
      </div>
      
      {/* Page content padding for fixed header and footer */}
      <div className="pb-16 pt-16 md:pt-0"></div>
    </>
  );
};

export default Navigation;