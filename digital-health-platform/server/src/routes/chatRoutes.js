// server/src/routes/chatRoutes.js

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io } from "../../index.js";

const router = express.Router();

/* ============================================================
    SEND MESSAGE  (POST /api/chat/send)
============================================================ */
router.post("/send", protect, async (req, res) => {
  try {
    const { from, to, text } = req.body;

    if (!from || !to || !text) {
      return res.status(400).json({ message: "from, to, and text are required" });
    }

    // Save to MongoDB
    const msg = await Message.create({
      sender: from,
      receiver: to,
      text,
      read: false,
    });

    const populated = await Message.findById(msg._id)
      .populate("sender", "name")
      .populate("receiver", "name");

    // Emit real-time events
    io.to(to.toString()).emit("chat:message", populated);
    io.to(from.toString()).emit("chat:message", populated);

    res.status(201).json(populated);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error sending message" });
  }
});

/* ============================================================
    GET CHAT HISTORY (GET /api/chat/history/:id)
============================================================ */
router.get("/history/:id", protect, async (req, res) => {
  try {
    const partner = req.params.id;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partner },
        { sender: partner, receiver: userId },
      ],
    })
      .sort("createdAt")
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error loading history" });
  }
});

/* ============================================================
    LIST CONVERSATIONS (optional)
============================================================ */
router.get("/conversations/list", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const agg = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          text: 1,
          createdAt: 1,
          read: 1,
          sender: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$otherUser",
          lastText: { $first: "$text" },
          lastAt: { $first: "$createdAt" },
          lastSender: { $first: "$sender" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$receiver", userId] }, { $eq: ["$read", false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastAt: -1 } },
    ]);

    const results = await Promise.all(
      agg.map(async (a) => {
        const user = await User.findById(a._id).select("name email role");
        return {
          user,
          lastText: a.lastText,
          lastAt: a.lastAt,
          unreadCount: a.unreadCount,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("Conversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
