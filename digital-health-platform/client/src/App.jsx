// App.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Shadcn Toast Provider
import { Toaster } from "@/components/ui/toaster";

// Global socket notifications
import { initNotificationListeners } from "@/socket/globalNotifications";

// Socket instance
import { socket } from "@/socket";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Only connect socket AFTER login
    if (token && userId) {
      if (!socket.connected) {
        socket.connect();
        socket.emit("join", userId);
        console.log("🔗 Socket connected from App.jsx");
      }

      // Initialize notification listeners
      initNotificationListeners();
    }
  }, []);

  return (
    <>
      {/* Nested routes render here */}
      <Outlet />

      {/* Toast notifications */}
      <Toaster />
    </>
  );
}

export default App;
