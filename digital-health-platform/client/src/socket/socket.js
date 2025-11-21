// client/src/socket/socket.js
import { io } from "socket.io-client";

// Auto-select correct backend
const URL =
  import.meta.env.PROD
    ? "https://health-jgt3.onrender.com"
    : "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"], // Render requires websocket transport
  secure: true,
  reconnection: true,
  reconnectionAttempts: 10,
});
