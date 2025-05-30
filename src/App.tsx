import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import Navigation from './components/Navigation';
import BottomNavigation from './components/BottomNavigation';
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
import AddDose from './pages/AddDose';
import AddPrescription from './pages/AddPrescription';
import AddContact from './pages/AddContact';
import AddAppointment from './pages/AddAppointment';
import AddSymptom from './pages/AddSymptom';
import AddSideEffect from './pages/AddSideEffect';
import AddMeasurement from './pages/AddMeasurement';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// App layout with navigation
const AppLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <SidebarProvider>
      <div className="app-container font-primary text-gray-800 bg-gray-50 min-h-screen flex">
        <Navigation />
        <main className="flex-1 pt-16 overflow-auto transition-all duration-300">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};

export function App() {
  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/schedule" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Schedule />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medications" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Medications />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/follow-ups" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FollowUps />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Progress />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient-report" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PatientReport />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Payments />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/timeline" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Timeline />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          {/* New routes for bottom navigation */}
          <Route path="/ai-assistant" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AIAssistant />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/exercises" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Exercises />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/contacts" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Contacts />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/add-dose" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddDose />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          {/* Add routes for other add menu items */}
          <Route path="/add-prescription" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddPrescription />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/add-contact" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddContact />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/add-appointment" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddAppointment />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/add-symptom" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddSymptom />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/add-side-effect" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddSideEffect />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/add-measurement" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AddMeasurement />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/schedule" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
