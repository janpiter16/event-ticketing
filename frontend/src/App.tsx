import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { GuestRoute } from './components/layout/GuestRoute';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ParticipantTicketsPage } from './pages/ParticipantTicketsPage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { StaffCheckInPage } from './pages/StaffCheckInPage';
import { PaymentSimulationPage } from './pages/PaymentSimulationPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />

              {/* Guest Only Routes (Login/Register) */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Authenticated Users Only */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-tickets" element={<ParticipantTicketsPage />} />
                <Route path="/payment-simulation/:orderNumber" element={<PaymentSimulationPage />} />
              </Route>

              {/* Staff and Organizers Only */}
              <Route element={<ProtectedRoute allowedRoles={['staff', 'organizer', 'super-admin']} />}>
                <Route path="/staff/scan" element={<StaffCheckInPage />} />
              </Route>
            </Route>

            {/* Organizer and Admin Workspace */}
            <Route element={<ProtectedRoute allowedRoles={['organizer', 'super-admin']} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<OrganizerDashboardPage />} />
                <Route path="events/create" element={<CreateEventPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
