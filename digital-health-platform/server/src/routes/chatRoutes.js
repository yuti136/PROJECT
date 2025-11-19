import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import { io } from "../../index.js";

const router = express.Router();

// SEND MESSAGE
router.post("/send", protect, async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const msg = await Message.create({
      sender: req.user._id,
      receiver,
      text,
    });

    // Emit message via socket
    io.to(receiver.toString()).emit("chat:receive", msg);

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// GET MESSAGES BETWEEN 2 USERS
router.get("/:id", protect, async (req, res) => {
  try {
    const otherUserId = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

export default router;
