// client/src/socket/globalNotifications.js
import { socket } from "./socket";
import { toast } from "sonner";

let initialized = false;

export function initNotificationListeners() {
  if (initialized) return;
  initialized = true;

  console.log("🔔 Global Socket Notifications Active");

  /* ================================
        APPOINTMENT NOTIFICATIONS
     ================================ */
  socket.on("appointment:requested", (data) => {
    toast.info(
      `New appointment request from ${data.patientName} — ${new Date(
        data.scheduledAt
      ).toLocaleString()}`
    );
  });

  socket.on("appointment:created", (data) => {
    toast.success(
      `Appointment created — ${new Date(
        data.scheduledAt
      ).toLocaleString()}`
    );
  });

  socket.on("appointment:accepted", (data) => {
    toast.success(
      `Your appointment was accepted — ${new Date(
        data.scheduledAt
      ).toLocaleString()}`
    );
  });

  /* ================================
        REAL-TIME CHAT NOTIFICATIONS
     ================================ */
  socket.on("chat:message", (msg) => {
    // prevent notification appearing on your own messages
    const userId = localStorage.getItem("userId");
    if (msg.from === userId) return;

    toast(
      `${msg.fromName || "New message"}: ${msg.text.substring(0, 40)}...`
    );
  });
}
