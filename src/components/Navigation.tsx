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
      const target = event.target as HTMLElement;
      const mobileMenu = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (mobileMenu && !mobileMenu.contains(target) && menuButton && !menuButton.contains(target)) {
        setIsMobileMenuOpen(false);
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
  
  const closeAndNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Mobile top navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white h-16 shadow-sm z-40 px-4 flex items-center justify-between md:hidden">
        <button 
          id="mobile-menu-button"
          onClick={toggleMobileMenu} 
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">M</div>
          <span className="ml-2 font-medium">MediCare</span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={16} />
        </div>
      </header>
      
      {/* Mobile Sidebar - Always in DOM but conditionally visible */}
      <div 
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="bg-white h-full w-[280px] shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">M</div>
              <span className="ml-2 font-medium text-lg">MediCare</span>
            </div>
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close mobile menu"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Backdrop - only visible when sidebar is open */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-[-1]"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />
          )}
          
          <div className="p-2 overflow-y-auto h-[calc(100%-60px)]">
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => closeAndNavigate('/profile')}
                className={`flex items-center p-3 rounded-lg ${isActive('/profile') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <User size={20} className="mr-3" />
                <span className="font-medium">Profile</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/schedule')}
                className={`flex items-center p-3 rounded-lg ${isActive('/schedule') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <Calendar size={20} className="mr-3" />
                <span className="font-medium">Schedule</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/medications')}
                className={`flex items-center p-3 rounded-lg ${isActive('/medications') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <Pill size={20} className="mr-3" />
                <span className="font-medium">Medications</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/follow-ups')}
                className={`flex items-center p-3 rounded-lg ${isActive('/follow-ups') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <ClipboardList size={20} className="mr-3" />
                <span className="font-medium">Follow-ups</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/progress')}
                className={`flex items-center p-3 rounded-lg ${isActive('/progress') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <Activity size={20} className="mr-3" />
                <span className="font-medium">Progress</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/patient-report')}
                className={`flex items-center p-3 rounded-lg ${isActive('/patient-report') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <ClipboardList size={20} className="mr-3" />
                <span className="font-medium">Patient Report</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/payments')}
                className={`flex items-center p-3 rounded-lg ${isActive('/payments') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <Wallet size={20} className="mr-3" />
                <span className="font-medium">Payments</span>
              </button>
              
              <button 
                onClick={() => closeAndNavigate('/timeline')}
                className={`flex items-center p-3 rounded-lg ${isActive('/timeline') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
              >
                <Clock size={20} className="mr-3" />
                <span className="font-medium">Timeline</span>
              </button>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 w-full"
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
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
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
              className={`flex items-center p-3 rounded-lg ${isActive('/profile') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <User size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Profile</span>}
            </button>
            <button 
              onClick={() => navigate('/schedule')}
              className={`flex items-center p-3 rounded-lg ${isActive('/schedule') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Calendar size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Schedule</span>}
            </button>
            <button 
              onClick={() => navigate('/medications')}
              className={`flex items-center p-3 rounded-lg ${isActive('/medications') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Pill size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Medications</span>}
            </button>
            <button 
              onClick={() => navigate('/follow-ups')}
              className={`flex items-center p-3 rounded-lg ${isActive('/follow-ups') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <ClipboardList size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Follow-ups</span>}
            </button>
            <button 
              onClick={() => navigate('/progress')}
              className={`flex items-center p-3 rounded-lg ${isActive('/progress') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Activity size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Progress</span>}
            </button>
            <button 
              onClick={() => navigate('/patient-report')}
              className={`flex items-center p-3 rounded-lg ${isActive('/patient-report') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <ClipboardList size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Patient Report</span>}
            </button>
            <button 
              onClick={() => navigate('/payments')}
              className={`flex items-center p-3 rounded-lg ${isActive('/payments') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Wallet size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Payments</span>}
            </button>
            <button 
              onClick={() => navigate('/timeline')}
              className={`flex items-center p-3 rounded-lg ${isActive('/timeline') ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'}`}
            >
              <div className="w-6 flex justify-center">
                <Clock size={20} />
              </div>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">Timeline</span>}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Bottom mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-40 md:hidden">
        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}
        >
          <User size={20} />
          <span className="text-xs font-medium">Profile</span>
        </button>
        <button 
          onClick={() => navigate('/schedule')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/schedule') ? 'text-primary' : 'text-gray-500'}`}
        >
          <Calendar size={20} />
          <span className="text-xs font-medium">Schedule</span>
        </button>
        
        <button 
          onClick={() => navigate('/medications')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/medications') ? 'text-primary' : 'text-gray-500'}`}
        >
          <Pill size={20} />
          <span className="text-xs font-medium">Meds</span>
        </button>
        
        <button 
          onClick={() => navigate('/follow-ups')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/follow-ups') ? 'text-primary' : 'text-gray-500'}`}
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
