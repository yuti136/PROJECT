import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import PatientAppointments from "./pages/PatientAppointments.jsx";
import ProviderAppointments from "./pages/ProviderAppointments.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// ADMIN COMPONENTS
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminHome from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminProviders from "./pages/admin/Providers.jsx";
import AdminPatients from "./pages/admin/Patients.jsx";
import AdminAppointments from "./pages/admin/Appointments.jsx";

// VIDEO CALL
import VideoCall from "./pages/VideoCall.jsx";

// CHAT PAGE 👍
import Chat from "./pages/Chat.jsx";

// 🔔 Shadcn Toast Provider
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
      <Routes>
        {/* ROOT */}
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* APPOINTMENTS */}
        <Route
          path="/appointments/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/provider"
          element={
            <ProtectedRoute role="provider">
              <ProviderAppointments />
            </ProtectedRoute>
          }
        />

        {/* VIDEO CALL ROUTE */}
        <Route
          path="/call/:roomId"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            CHAT ROUTE
           ========================== */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            ADMIN PANEL ROUTES
           ========================== */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminHome />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/providers"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProviders />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminPatients />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminAppointments />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>

      {/* GLOBAL TOASTER */}
      <Toaster />
    </>
  </BrowserRouter>
);
