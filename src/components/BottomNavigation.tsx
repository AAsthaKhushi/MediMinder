import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  Dumbbell, 
  Users, 
  Plus
} from 'lucide-react';
import AddMenu from './AddMenu';

// Bottom navigation component

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const toggleAddMenu = () => {
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const closeAddMenu = () => {
    setIsAddMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    closeAddMenu();
  };

    // We'll use the AddMenu component instead of defining options here

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 px-2">
        <button 
          onClick={() => handleNavigate('/ai-assistant')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/ai-assistant') ? 'text-primary' : 'text-gray-500'}`}
          aria-label="AI Chat Assistant"
        >
          <MessageCircle size={24} />
          <span className="text-xs font-medium">Ask AI</span>
        </button>

        <button 
          onClick={() => handleNavigate('/exercises')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/exercises') ? 'text-primary' : 'text-gray-500'}`}
          aria-label="Physical Exercises"
        >
          <Dumbbell size={24} />
          <span className="text-xs font-medium">Exercises</span>
        </button>

        <button 
          onClick={() => handleNavigate('/contacts')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isActive('/contacts') ? 'text-primary' : 'text-gray-500'}`}
          aria-label="Manage Contacts"
        >
          <Users size={24} />
          <span className="text-xs font-medium">Contacts</span>
        </button>

        <div className="relative">
          <button 
            onClick={toggleAddMenu}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 ${isAddMenuOpen ? 'text-primary' : 'text-gray-500'}`}
            aria-label="Add Menu"
            aria-expanded={isAddMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg transform -translate-y-4 hover:scale-105 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-xs font-medium mt-1">Add</span>
          </button>
          
          {/* Use the AddMenu component */}
          <AddMenu isOpen={isAddMenuOpen} onClose={closeAddMenu} />
        </div>
      </div>

      {/* We'll remove this padding div as we'll handle the padding in PageContainer */}
    </>
  );
};

export default BottomNavigation;
