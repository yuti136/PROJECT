
console.log("TEST 1: Importing express...");
import express from "express";

console.log("TEST 2: About to import User model...");
import User from "../models/User.js";

console.log("TEST 3: About to import Appointment model...");
import Appointment from "../models/appointment.js";

console.log("TEST 4: About to import authMiddleware...");
import { protect } from "../middleware/authMiddleware.js";

console.log("TEST 5: About to import roleMiddleware...");
import { authorizeRoles } from "../middleware/roleMiddleware.js";

console.log("TEST 6: All imports passed. Creating router...");
const router = express.Router();

console.log("TEST 7: Router created successfully.");




/* =========================================================
   ADMIN: GET ALL USERS
========================================================= */
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching users" });
  }
});

/* =========================================================
   ADMIN: GET PROVIDERS ONLY
========================================================= */
router.get("/providers", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select("-password");
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching providers" });
  }
});

/* =========================================================
   ADMIN: GET PATIENTS ONLY
========================================================= */
router.get("/patients", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching patients" });
  }
});

/* =========================================================
   ADMIN: PROMOTE USER TO PROVIDER
========================================================= */
router.put("/promote/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.role = "provider";
    await user.save();

    res.json({ message: "User promoted to provider", user });
  } catch (err) {
    res.status(500).json({ message: "Server error promoting user" });
  }
});

/* =========================================================
   ADMIN: APPROVE PROVIDER VERIFICATION
========================================================= */
router.put("/approve-provider/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Provider approved", user });
  } catch (err) {
    res.status(500).json({ message: "Server error approving provider" });
  }
});

/* =========================================================
   ADMIN: SUSPEND USER (DEACTIVATE ACCOUNT)
========================================================= */
router.put("/suspend/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();

    res.json({ message: "User suspended", user });
  } catch (err) {
    res.status(500).json({ message: "Server error suspending user" });
  }
});

/* =========================================================
   ADMIN: DELETE USER
========================================================= */
router.delete("/delete/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting user" });
  }
});

/* =========================================================
   ADMIN: VIEW ALL APPOINTMENTS
========================================================= */
router.get("/appointments", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("provider", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching appointments" });
  }
});

/* =========================================================
   ADMIN: CANCEL AN APPOINTMENT
========================================================= */
router.put(
  "/appointments/cancel/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const appt = await Appointment.findById(req.params.id);
      if (!appt)
        return res.status(404).json({ message: "Appointment not found" });

      appt.status = "cancelled";
      await appt.save();

      res.json({ message: "Appointment cancelled", appt });
    } catch (err) {
      console.error("Cancel error:", err);
      res.status(500).json({ message: "Server error cancelling appointment" });
    }
  }
);

/* =========================================================
   ADMIN: DELETE AN APPOINTMENT
========================================================= */
router.delete(
  "/appointments/delete/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const appt = await Appointment.findByIdAndDelete(req.params.id);
      if (!appt)
        return res.status(404).json({ message: "Appointment not found" });

      res.json({ message: "Appointment deleted", appt });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ message: "Server error deleting appointment" });
    }
  }
);

/* =========================================================
   ADMIN: ANALYTICS (DASHBOARD STATS)
========================================================= */
router.get("/stats", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: "provider" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalProviders,
      totalPatients,
      totalAppointments,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
});

console.log(">>> adminRoutes.js LOADED OK");
export default router;


