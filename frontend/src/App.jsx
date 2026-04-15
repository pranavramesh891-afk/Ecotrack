import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogWaste from './pages/LogWaste';
import RecyclingCenters from './pages/RecyclingCenters';
import CenterDetails from './pages/CenterDetails';
import Signup from './pages/Signup';
import './index.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('ecoToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout with Navbar for protected routes
const MainLayout = ({ children }) => (
  <div className="app-container">
    <Navbar />
    <main>
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <div className="app-container">
            <Login />
          </div>
        } />
        
        <Route path="/signup" element={
          <div className="app-container">
            <Signup />
          </div>
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/log" element={
          <ProtectedRoute>
            <MainLayout><LogWaste /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/recycling" element={
          <ProtectedRoute>
            <MainLayout><RecyclingCenters /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/center/:id" element={
          <ProtectedRoute>
            <MainLayout><CenterDetails /></MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
