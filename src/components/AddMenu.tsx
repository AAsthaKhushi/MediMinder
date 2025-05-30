import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {  
  X, 
  Pill, 
  Calendar, 
  Users, 
  Stethoscope, 
  AlertTriangle, 
  Activity,
  FileText,
} from 'lucide-react';

interface AddMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  icon: JSX.Element;
  label: string;
  route: string;
  color: string;
}

const AddMenu: React.FC<AddMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Define menu items
  const menuItems: MenuItem[] = [
    {
      id: 'dose',
      icon: <Pill size={20} />,
      label: 'Add Dose',
      route: '/add-dose',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'prescription',
      icon: <FileText size={20} />,
      label: 'Add Prescription',
      route: '/add-prescription',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'contact',
      icon: <Users size={20} />,
      label: 'Add Contact',
      route: '/add-contact',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'appointment',
      icon: <Calendar size={20} />,
      label: 'Add Appointment',
      route: '/add-appointment',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'symptom',
      icon: <AlertTriangle size={20} />,
      label: 'Add Symptom',
      route: '/add-symptom',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'side-effect',
      icon: <Stethoscope size={20} />,
      label: 'Add Side Effect',
      route: '/add-side-effect',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'measurement',
      icon: <Activity size={20} />,
      label: 'Add Measurement',
      route: '/add-measurement',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Set animation complete after a small delay
      const timer = setTimeout(() => {
      }, 300);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(timer);
      };
    } else {
      return undefined;
    }
  }, [isOpen, onClose]);

  // Handle menu item click
  const handleMenuItemClick = (route: string) => {
    onClose();
    navigate(route);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-24 px-4 add-menu-backdrop">
      <div 
        className="bg-black bg-opacity-50 absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        ref={menuRef}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative z-10 add-menu-container"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.route)}
              className={`flex flex-col items-center p-3 rounded-lg ${item.color} add-menu-item`}
              style={{ '--item-index': index } as React.CSSProperties}
            >
              <div className="mb-2">{item.icon}</div>
              <span className="text-xs font-medium text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
