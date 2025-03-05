const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const moderationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return generateUUID("mod-");
      },
    },
    kycId: {
      type: String, // Reference to the KYC model
      required: true,
    },
    idRecogData: {
      type: Object,
      default: {},
    },
    faceRecogData: {
      type: Object,
      default: {},
    },
    faceLiveData: {
      type: Object,
      default: {},
    },

    errorLogs: {
      type: [String], // Array to store error messages
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Failed", "Completed"], // Tracks the moderation process status
      default: "Pending",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Moderation", moderationSchema);
