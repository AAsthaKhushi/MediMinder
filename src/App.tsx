import { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import './index.css';

// Components
import Navigation from './components/Navigation';
import BottomNavigation from './components/BottomNavigation';

// Pages
import Schedule from './pages/Schedule';
import Medications from './pages/Medications';
import FollowUps from './pages/FollowUps';
import PatientReport from './pages/PatientReport';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Timeline from './pages/Timeline';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AIAssistant from './pages/AIAssistant';
import Exercises from './pages/Exercises';
import Contacts from './pages/Contacts';

// Add Pages
import AddDose from './pages/AddDose';
import AddPrescription from './pages/AddPrescription';
import AddContact from './pages/AddContact';
import AddAppointment from './pages/AddAppointment';
import AddSymptom from './pages/AddSymptom';
import AddSideEffect from './pages/AddSideEffect';
import AddMeasurement from './pages/AddMeasurement';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';

// Types
interface ProtectedRouteProps {
  children: JSX.Element;
}

interface AppLayoutProps {
  children: JSX.Element;
}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// App Layout Component
const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="app-container font-primary text-gray-800 bg-gray-50 min-h-screen flex">
        <Navigation />
        <main className="flex-1 pt-16 overflow-auto transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};

// Route Configuration
const protectedRoutes = [
  { path: '/schedule', component: Schedule },
  { path: '/medications', component: Medications },
  { path: '/follow-ups', component: FollowUps },
  { path: '/progress', component: Progress },
  { path: '/patient-report', component: PatientReport },
  { path: '/profile', component: Profile },
  { path: '/payments', component: Payments },
  { path: '/timeline', component: Timeline },
  { path: '/ai-assistant', component: AIAssistant },
  { path: '/exercises', component: Exercises },
  { path: '/contacts', component: Contacts },
  { path: '/add-dose', component: AddDose },
  { path: '/add-prescription', component: AddPrescription },
  { path: '/add-contact', component: AddContact },
  { path: '/add-appointment', component: AddAppointment },
  { path: '/add-symptom', component: AddSymptom },
  { path: '/add-side-effect', component: AddSideEffect },
  { path: '/add-measurement', component: AddMeasurement },
];

// Font Loader Hook
const useFontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href="${link.href}"]`);
    if (!existingLink) {
      document.head.appendChild(link);
    }
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
};

// Main App Component
export function App() {
  useFontLoader();

  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/signup" 
              element={<SignUp />} 
            />
            
            {/* Protected Routes */}
            {protectedRoutes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Component />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            ))}
            
            {/* Default Route */}
            <Route 
              path="/" 
              element={<Navigate to="/schedule" replace />} 
            />
            
            {/* Catch All Route */}
            <Route 
              path="*" 
              element={<Navigate to="/schedule" replace />} 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;