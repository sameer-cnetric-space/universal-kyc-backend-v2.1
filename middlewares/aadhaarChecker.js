function checkAadhaarVerification(req, res, next) {
  try {
    // Ensure user exists in request
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Extract isAadhaarVerified safely
    const isAadhaarVerified = req.user.isAadhaarVerified || false;

    // Check if Aadhaar is verified
    if (!isAadhaarVerified) {
      return res
        .status(403)
        .json({ message: "Access Denied: Aadhaar verification required" });
    }

    // Proceed if Aadhaar is verified
    next();
  } catch (error) {
    console.error("Error in Aadhaar verification middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = checkAadhaarVerification;
