import { io } from "socket.io-client";

// Correct BASE URL auto-switch
const URL = import.meta.env.MODE === "production"
  ? "https://health-jgt3.onrender.com"      // Render backend URL
  : "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
});
