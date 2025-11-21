import { io } from "socket.io-client";

const URL = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL   // use .env in production
  : "http://localhost:5000";            // use localhost in dev

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
});
console.log("ENV BACKEND:", import.meta.env.VITE_BACKEND_URL);
