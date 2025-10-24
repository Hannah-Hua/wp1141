import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CafeDetailPage from './pages/CafeDetailPage';
import CafeFormPage from './pages/CafeFormPage';
import VisitsPage from './pages/VisitsPage';
import WishlistPage from './pages/WishlistPage';

// 受保護的路由組件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAppContext();
  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cafe/:id"
        element={
          <ProtectedRoute>
            <CafeDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-cafe"
        element={
          <ProtectedRoute>
            <CafeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-cafe/:id"
        element={
          <ProtectedRoute>
            <CafeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visits"
        element={
          <ProtectedRoute>
            <VisitsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
