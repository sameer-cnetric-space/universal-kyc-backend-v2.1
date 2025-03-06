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
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          aadhaarData: data,
          isAadhaarVerified: true,
        },
        { new: true, runValidators: true } // Returns updated user & runs validation
      );

      if (!user) {
        throw new Error("User not found");
      }

      return true;
    } catch (error) {
      console.error("Error adding Aadhaar details:", error);
      throw new Error("Failed to add Aadhaar details");
    }
  }
}

module.exports = AadhaarHandler;
