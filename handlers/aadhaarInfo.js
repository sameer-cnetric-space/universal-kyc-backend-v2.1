const User = require("../models/user");

class AadhaarHandler {
  /**
   * Add or update Aadhaar details for a user.
   * @param {string} userId - The ID of the user.
   * @param {Object} data - Aadhaar details to store.
   * @returns {Promise<Object>} - API response with status and message.
   */
  static async addAadhaarDetails(userId, data) {
    if (!userId || !data || typeof data !== "object") {
      throw new Error(
        "Invalid input: userId and valid Aadhaar data are required"
      );
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.aadhaarData = data; // Directly assign data
      user.markModified("aadhaarData"); // Mark field as modified for Mongoose

      user.isAadhaarVerified = true;
      user.markModified("isAadhaarVerified");
      await user.save();

      return true;
    } catch (error) {
      console.error("Error adding Aadhaar details:", error);
      throw new Error("Failed to add Aadhaar details"); // Rethrow for higher-level error handling
    }
  }
}

module.exports = AadhaarHandler;
