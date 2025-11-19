import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Shadcn Toast Provider
import { Toaster } from "@/components/ui/toaster";

// Global Socket.io notification initializer
import { initNotificationListeners } from "@/socket/globalNotifications";

function App() {

  // Initialize socket notifications once when the app loads
  useEffect(() => {
    initNotificationListeners();
  }, []);

  return (
    <>
      {/* All nested pages render here */}
      <Outlet />

      {/* Global Toast Notifications */}
      <Toaster />
    </>
  );
}

export default App;
