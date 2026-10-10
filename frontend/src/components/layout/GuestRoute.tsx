import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const GuestRoute: React.FC = () => {
  const { user, isLoading, isOrganizer, isSuperAdmin, isStaff } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  // If user is already logged in, redirect them away from auth pages
  if (user) {
    if (isOrganizer || isSuperAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    if (isStaff) {
      return <Navigate to="/staff/scan" replace />;
    }
    // Default redirect for participants
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
