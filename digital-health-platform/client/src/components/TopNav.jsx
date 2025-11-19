// client/src/components/TopNav.jsx

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileSidebar from "@/components/MobileSidebar";

// SOCKET
import { socket } from "@/socket";

// SHADCN TOAST
import { useToast } from "@/components/ui/use-toast.js";

export default function TopNav() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId"); // needed for call notifications
  const { toast } = useToast();

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // ==========================================
    // PROVIDER — NEW APPOINTMENT REQUEST
    // ==========================================
    socket.on("appointment:requested", (data) => {
      if (role === "provider" || role === "admin") {
        toast({
          title: "New Appointment Request",
          description: `${data.patientName} booked for ${new Date(
            data.scheduledAt
          ).toLocaleString()}`,
          duration: 5000,
        });
        setNotificationCount((prev) => prev + 1);
      }
    });

    // ==========================================
    // PATIENT — APPOINTMENT CREATED
    // ==========================================
    socket.on("appointment:created", (data) => {
      if (role === "patient") {
        toast({
          title: "Appointment Created",
          description: `Your appointment on ${new Date(
            data.scheduledAt
          ).toLocaleString()} has been submitted.`,
          duration: 4000,
        });
      }
    });

    // ==========================================
    // PATIENT — APPOINTMENT ACCEPTED
    // ==========================================
    socket.on("appointment:accepted", (data) => {
      if (role === "patient") {
        toast({
          title: "Appointment Accepted",
          description: `${data.providerName} accepted your appointment for ${new Date(
            data.scheduledAt
          ).toLocaleString()}.`,
          duration: 5000,
        });
      }
    });

    // ==========================================
    // 🔥 NEW — INCOMING VIDEO CALL LISTENER
    // ==========================================
    socket.on("call:incoming", (data) => {
      console.log("Incoming call:", data);

      // Display toast for all roles
      toast({
        title: "Incoming Video Call",
        description: `Your appointment (#${data.appointmentId}) has started.`,
        duration: 6000,
      });

      // Auto-redirect after 1s (optional)
      setTimeout(() => {
        window.location.href = `/call/${data.meetingId}`;
      }, 1000);
    });

    // Cleanup
    return () => {
      socket.off("appointment:requested");
      socket.off("appointment:created");
      socket.off("appointment:accepted");
      socket.off("call:incoming");
    };
  }, [toast, role, userId]);

  return (
    <header className="w-full bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MobileSidebar />
        <Input
          placeholder="Search patients, appointments..."
          className="w-40 sm:w-72 md:w-96"
        />
      </div>

      <div className="flex items-center gap-3">
        {(role === "provider" || role === "admin") && (
          <div className="relative mr-2 cursor-pointer">
            <span className="text-gray-700 text-xl">🔔</span>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {notificationCount}
              </span>
            )}
          </div>
        )}

        <span className="text-sm text-gray-600 hidden sm:block">{role}</span>

        <Button
          variant="outline"
          onClick={() => window.location.href = "/appointments/patient"}
        >
          New Appointment
        </Button>
      </div>
    </header>
  );
}
