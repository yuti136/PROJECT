// index.js — FULL VERSION (Auth + Roles + Analytics + WebRTC + Chat)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

console.log("Index.js START");

// ROUTES
import authRoutes from "./src/routes/auth.js";
console.log("Loaded auth.js");

import userRoutes from "./src/routes/userRoutes.js";
console.log("Loaded userRoutes.js");

import appointmentRoutes from "./src/routes/appointmentRoutes.js";
console.log("Loaded appointmentRoutes.js");

import analyticsRoutes from "./src/routes/analyticsRoutes.js";
console.log("Loaded analyticsRoutes.js");

import adminRoutes from "./src/routes/adminRoutes.js";
console.log("Loaded adminRoutes.js");

import chatRoutes from "./src/routes/chatRoutes.js";
console.log("Loaded chatRoutes.js");

// MIDDLEWARE
import { protect } from "./src/middleware/authMiddleware.js";
import { authorizeRoles } from "./src/middleware/roleMiddleware.js";

// SOCKET.IO
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Export socket instance
export { io };

/* =========================================================
   SOCKET.IO — CHAT + VIDEO CALL + NOTIFICATIONS
========================================================= */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined private room`);
  });

  /* ----------------------------- CHAT ----------------------------- */

  socket.on("chat:typing", ({ from, to }) => {
    io.to(to).emit("chat:typing", { from });
  });

  socket.on("chat:send", (msg) => {
    console.log("CHAT MESSAGE EVENT:", msg);

    io.to(msg.to).emit("chat:message", msg);
    io.to(msg.from).emit("chat:message", msg);
  });

  /* --------------------------- VIDEO CALL ------------------------- */

  socket.on("join-call", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined call room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("webrtc-offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("webrtc-offer", offer);
  });

  socket.on("webrtc-answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("webrtc-answer", answer);
  });

  socket.on("webrtc-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("webrtc-candidate", candidate);
  });

  socket.on("end-call", (roomId) => {
    socket.to(roomId).emit("call-ended");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =========================================================
    EXPRESS MIDDLEWARE + ROUTES
========================================================= */

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

/* Debug Protected Routes */
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected OK", user: req.user });
});

app.get("/api/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

/* =========================================================
    DATABASE + SERVER START
========================================================= */

app.get("/", (req, res) => {
  res.send("Digital Health Platform API is running...");
});

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ⭐ IMPORTANT FOR RENDER ⭐
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
