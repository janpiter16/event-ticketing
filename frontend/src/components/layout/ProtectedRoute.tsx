import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  redirectTo = '/' 
}) => {
  const { user, isLoading, isOrganizer, isStaff, isSuperAdmin, isParticipant } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, just being logged in is enough
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Check roles
  const hasAccess = allowedRoles.some(role => {
    switch (role) {
      case 'organizer': return isOrganizer;
      case 'staff': return isStaff;
      case 'super-admin': return isSuperAdmin;
      case 'participant': return isParticipant;
      default: return false;
    }
  });

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
