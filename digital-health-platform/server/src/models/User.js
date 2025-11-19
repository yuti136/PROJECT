import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "provider", "admin"],
      default: "patient",
    },

    // For suspending accounts (admin action)
    isActive: {
      type: Boolean,
      default: true,
    },

    // ADMIN-approved provider status
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Provider-specific information
    providerInfo: {
      specialization: { type: String },
      licenseNumber: { type: String },
      yearsExperience: { type: Number },

      // Optional — later for license document uploads
      documents: [{ type: String }],
    },

    // Optional — For profile display
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
