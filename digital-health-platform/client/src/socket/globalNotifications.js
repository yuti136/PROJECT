// client/src/socket/globalNotifications.js
import { socket } from "./socket";
import { toast } from "sonner"; // Sonner works globally

let initialized = false;

export function initNotificationListeners() {
  if (initialized) return;
  initialized = true;

  console.log("🔔 Socket notifications active...");

  /* ========================================
       APPOINTMENTS
  =========================================== */

  socket.on("appointment:requested", (data) => {
    toast.info(
      `New appointment request from ${data.patientName} for ${new Date(
        data.scheduledAt
      ).toLocaleString()}`
    );
  });

  socket.on("appointment:created", (data) => {
    toast.success(
      `Appointment created for ${new Date(
        data.scheduledAt
      ).toLocaleString()}`
    );
  });

  socket.on("appointment:accepted", (data) => {
    toast.success(
      `Your appointment was accepted — scheduled at ${new Date(
        data.scheduledAt
      ).toLocaleString()}`
    );
  });

  /* ========================================
       CHAT NOTIFICATIONS
  =========================================== */
  socket.on("chat:message", (msg) => {
    toast(
      `${msg.fromName || "New Message"}: ${msg.text.substring(0, 40)}...`
    );
  });
}
