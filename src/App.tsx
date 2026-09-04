import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VehicleProvider } from './context/VehicleContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { GoogleAuthPage } from './pages/GoogleAuthPage';
import { VehicleSelectionPage } from './pages/VehicleSelectionPage';
import { VehicleSetupPage } from './pages/VehicleSetupPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <VehicleProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Onboarding Flow */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/google" element={<GoogleAuthPage />} />

          {/* Vehicle Selection & Setup Flow */}
          <Route path="/select-vehicle" element={<VehicleSelectionPage />} />
          <Route path="/vehicle-setup" element={<VehicleSetupPage />} />

          {/* Core Dashboard & Subsystem Views */}
          <Route path="/dashboard" element={<DashboardPage initialTab="dashboard" />} />
          <Route path="/diagnostics" element={<DashboardPage initialTab="diagnostics" />} />
          <Route path="/live-data" element={<DashboardPage initialTab="liveData" />} />
          <Route path="/3d-twin" element={<DashboardPage initialTab="digitalTwin" />} />
          <Route path="/maintenance" element={<DashboardPage initialTab="maintenance" />} />
          <Route path="/reports" element={<DashboardPage initialTab="reports" />} />
          <Route path="/alerts" element={<DashboardPage initialTab="alerts" />} />
          <Route path="/history" element={<DashboardPage initialTab="history" />} />
          <Route path="/settings" element={<DashboardPage initialTab="settings" />} />

          {/* Fallback to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </VehicleProvider>
  );
};

export default App;
