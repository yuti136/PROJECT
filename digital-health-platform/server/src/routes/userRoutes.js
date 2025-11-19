// server/src/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";
import User from "../models/User.js"; // <-- NOTE: capital 'U' matches the filename

const router = express.Router();

// GET logged-in user profile
router.get("/me", protect, getMyProfile);

// UPDATE logged-in user profile
router.put("/me", protect, updateMyProfile);

// GET all providers (for appointment dropdown)
// Protected so only authenticated patients or providers can view
router.get("/providers", protect, async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select("-password");
    res.json(providers);
  } catch (err) {
    console.error("Provider fetch error:", err);
    res.status(500).json({ message: "Server error fetching providers" });
  }
});

export default router;
