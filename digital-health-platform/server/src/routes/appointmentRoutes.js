// server/src/routes/appointmentRoutes.js

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import Appointment from "../models/appointment.js";

// socket.io instance
import { io } from "../../index.js";

const router = express.Router();

/* =========================================================
   PATIENT: CREATE APPOINTMENT
========================================================= */
router.post("/", protect, authorizeRoles("patient"), async (req, res) => {
  try {
    const { scheduledAt, provider } = req.body;

    if (!scheduledAt || !provider) {
      return res.status(400).json({ message: "Provider and date are required" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      provider,
      scheduledAt,
    });

    // Notify provider
    io.to(provider.toString()).emit("appointment:requested", {
      appointmentId: appointment._id,
      patientName: req.user.name,
      scheduledAt,
    });

    // Notify patient
    io.to(req.user._id.toString()).emit("appointment:created", {
      appointmentId: appointment._id,
      scheduledAt,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   PATIENT & PROVIDER: GET OWN APPOINTMENTS
========================================================= */
router.get("/", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "patient"
        ? { patient: req.user._id }
        : { provider: req.user._id };

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("provider", "name email phone");

    res.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   PROVIDER: ACCEPT APPOINTMENT
========================================================= */
router.put("/accept/:id", protect, authorizeRoles("provider"), async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // Ensure provider owns appointment
    if (appt.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized provider" });
    }

    appt.status = "accepted";
    await appt.save();

    // Realtime notify patient
    io.to(appt.patient.toString()).emit("appointment:accepted", {
      appointmentId: appt._id,
      providerName: req.user.name,
      scheduledAt: appt.scheduledAt,
    });

    res.json({ message: "Appointment accepted", appt });
  } catch (error) {
    console.error("Accept appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   PROVIDER: REJECT APPOINTMENT (NEW)
========================================================= */
router.put("/reject/:id", protect, authorizeRoles("provider"), async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // Ensure provider owns appointment
    if (appt.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized provider" });
    }

    appt.status = "rejected";
    await appt.save();

    // Notify patient realtime
    io.to(appt.patient.toString()).emit("appointment:rejected", {
      appointmentId: appt._id,
      providerName: req.user.name,
    });

    res.json({ message: "Appointment rejected", appt });
  } catch (error) {
    console.error("Reject appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
