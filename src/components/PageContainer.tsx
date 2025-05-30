import { ReactNode } from 'react';
import { Bell, EllipsisVertical } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  actionButton?: ReactNode;
}

const PageContainer = ({ title, children, actionButton }: PageContainerProps) => {
  const { isSidebarCollapsed } = useSidebar();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header - Only shows on small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                {actionButton}
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Header - Shows only on medium screens and up */}
      <div className={`hidden md:block fixed top-0 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} right-0 bg-white border-b border-gray-200 z-30 transition-all duration-300`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="flex items-center gap-3">
              {actionButton}
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <EllipsisVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 pt-16 md:pt-6 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'} transition-all duration-300`}>
        <div className="p-4 pb-20 md:p-6 md:pb-24 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
