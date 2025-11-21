// index.js — FULL VERSION (Auth + Roles + Analytics + WebRTC + Chat)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/userRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

// MIDDLEWARE
import { protect } from "./src/middleware/authMiddleware.js";
import { authorizeRoles } from "./src/middleware/roleMiddleware.js";

import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ⭐ FIXED FOR RENDER + FRONTEND
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://health-4ewd9u0i3-euticus-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

export { io };

/* =========================================================
   SOCKET.IO — CHAT + VIDEO CALL + NOTIFICATIONS
========================================================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });

  /* ---------------------- CHAT ---------------------- */
  socket.on("chat:typing", ({ from, to }) => {
    io.to(to).emit("chat:typing", { from });
  });

  socket.on("chat:send", (msg) => {
    // Emit to receiver and sender
    io.to(msg.to).emit("chat:message", msg);
    io.to(msg.from).emit("chat:message", msg);
  });

  /* --------------------- WEBRTC --------------------- */
  socket.on("join-call", (roomId) => {
    socket.join(roomId);
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

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Debug route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected OK", user: req.user });
});

app.get("/api/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

// Root route for Render health checks
app.get("/", (req, res) => {
  res.send("Digital Health Platform API is running...");
});

/* =========================================================
   DATABASE + SERVER START
========================================================= */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in environment variables");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
