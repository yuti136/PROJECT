// index.js — FULL VERSION (Auth + Roles + Analytics + WebRTC + Chat)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/userRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

import { protect } from "./src/middleware/authMiddleware.js";
import { authorizeRoles } from "./src/middleware/roleMiddleware.js";

import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✔ Allowed frontend URLs (local + vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "https://health-4ewd9u0i3-euticus-projects.vercel.app",
];

/* =========================================================
   GLOBAL CORS MIDDLEWARE (Express v5 SAFE)
========================================================= */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ❌ DO NOT add app.options("*") — breaks Express v5

app.use(express.json());

/* =========================================================
   SOCKET.IO — with CORS
========================================================= */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export { io };

/* =========================================================
   SOCKET.IO EVENTS
========================================================= */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });

  /* ---------------- CHAT ---------------- */
  socket.on("chat:typing", ({ from, to }) => {
    io.to(to).emit("chat:typing", { from });
  });

  socket.on("chat:send", (msg) => {
    io.to(msg.to).emit("chat:message", msg);   // to receiver
    io.to(msg.from).emit("chat:message", msg); // to sender
  });

  /* ---------------- WEBRTC ---------------- */
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
   API ROUTES
========================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Debug routes
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected OK", user: req.user });
});

app.get("/api/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

// For Render health check
app.get("/", (req, res) => {
  res.send("Digital Health Platform API is running...");
});

/* =========================================================
   DATABASE + SERVER START
========================================================= */
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
