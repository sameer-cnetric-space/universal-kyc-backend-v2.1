const { authToken, domain } = require("../config/aadhaar");
const requestREST = require("../config/axiosClient");

class AadhaarService {
  static #auth = authToken;
  static #domain = domain;

  /**
   * Generates an OTP for Aadhaar authentication.
   * @param {string} aadhaarNumber - The Aadhaar number.
   * @returns {Promise<Object>} - API response data.
   */
  static async getOtp(aadhaarNumber) {
    try {
      const response = await requestREST({
        method: "POST",
        url: "/api/v1/aadhaar-v2/generate-otp",
        baseURL: this.#domain,
        data: { id_number: aadhaarNumber },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#auth}`,
        },
      });
      //console.log(response);

      if (response.status !== 200 || !response.data.success) {
        throw new Error(
          `OTP request failed: ${
            response.data?.message || "Unexpected response"
          }`
        );
      }

      return response.data;
    } catch (error) {
      //console.error("Error in getOtp:", error.message);
      throw new Error("OTP request failed " + error.message); // Rethrowing to maintain centralized error handling
    }
  }

  /**
   * Verifies an OTP for Aadhaar authentication.
   * @param {string} key - Client ID received from OTP request.
   * @param {string} otp - One-time password received by the user.
   * @returns {Promise<Object>} - API response data.
   */
  static async verifyOtp(key, otp) {
    try {
      const response = await requestREST({
        method: "POST",
        url: "/api/v1/aadhaar-v2/submit-otp",
        baseURL: this.#domain,
        data: { client_id: key, otp },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#auth}`,
        },
      });

      if (response.status !== 200 || !response.data.success) {
        throw new Error(
          `OTP verification failed: ${
            response.data?.message || "Unexpected response"
          }`
        );
      }

      return response.data;
    } catch (error) {
      //console.error("Error in verifyOtp:", error.message);
      throw new Error("OTP verification failed " + error.message);
    }
  }
}

module.exports = AadhaarService;
