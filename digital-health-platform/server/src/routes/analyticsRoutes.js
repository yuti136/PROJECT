import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Appointment from "../models/appointment.js";

const router = express.Router();

/**
 * GET /api/analytics/appointments
 * Returns last 30 days of appointment count per day
 */
router.get("/appointments", protect, async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);

    const raw = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: today }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = raw.map((item) => ({
      date: item._id,
      count: item.count
    }));

    res.json({ last30Days: formatted });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Analytics error" });
  }
});

export default router;
