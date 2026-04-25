import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogWaste from './pages/LogWaste';
import RecyclingCenters from './pages/RecyclingCenters';
import CenterDetails from './pages/CenterDetails';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import './index.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('ecoToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout with TopHeader + BottomNav for protected routes
const MainLayout = ({ children }) => (
  <div className="app-shell">
    <BottomNav />
    <main className="page-content">
      {children}
    </main>
  </div>
);

// Auth layout – no nav
const AuthLayout = ({ children }) => (
  <div className="auth-page">
    {children}
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />

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

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><Profile /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
