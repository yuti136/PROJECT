// client/src/socket/socket.js
import { io } from "socket.io-client";

// Backend URLs
const PROD_URL = "https://health-jgt3.onrender.com";  // Render backend
const DEV_URL = "http://localhost:5000";

// Pick correct URL based on environment
const URL = import.meta.env.PROD ? PROD_URL : DEV_URL;

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],  // Required for Render
  reconnection: true,
  reconnectionAttempts: 10,
});
