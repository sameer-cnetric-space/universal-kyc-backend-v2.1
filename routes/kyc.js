const express = require("express");
const KycController = require("../controllers/kyc");
const validate = require("../middlewares/validate");
const {
  kycSchema,
  validateAadhaar,
  validateAadhaarOtp,
} = require("../validations/kyc");
const { upload } = require("../services/fileHandler");
const userAuth = require("../middlewares/auth/user");
const { adminAuth } = require("../middlewares/auth/admin");
const {
  checkExistingModeration,
} = require("../middlewares/moderationValidator");
const checkAadhaarVerification = require("../middlewares/aadhaarChecker");

const {
  checkKycExists,
  checkKycStatus,
  checkKycAssets,
} = require("../middlewares/kycValidator");
const router = express.Router();
const { userRateLimiter, adminRateLimiter } = require("../utils/rateLimiter");

//Aadhaar Validation Apis
router.post(
  "/validate-aadhaar",
  userAuth,
  validate(validateAadhaar),
  KycController.validateAadhaar
);
router.post(
  "/validate-aadhaar-otp",
  userAuth,
  validate(validateAadhaarOtp),
  KycController.validateAadhaarOtp
);

//Get all KYC Entries (For Admins)
router.get("/", adminRateLimiter, adminAuth, KycController.getAllKycEntries);

//Get all KYC Entries (For Users)
router.get(
  "/history",
  userRateLimiter,
  userAuth,
  checkAadhaarVerification,
  KycController.getUserKycEntries
);

// Get KYC details by ID (For Admins)
router.get(
  "/:id/admin",
  adminRateLimiter,
  adminAuth,
  KycController.getKycWithModeration
);

// Get KYC details by ID (User must be authenticated)
router.get(
  "/:id",
  userRateLimiter,
  userAuth,
  checkAadhaarVerification,
  KycController.getKycById
);

// Create a new KYC entry (User must be authenticated)
router.post(
  "/",
  userRateLimiter,
  userAuth,
  validate(kycSchema),
  checkKycStatus,
  checkAadhaarVerification,
  KycController.createKyc
);

// KYC submission (with Joi validation and Multer for file upload) (User must be authenticated)
router.post(
  "/:kycId/upload",
  userRateLimiter,
  userAuth,
  checkAadhaarVerification,
  checkKycAssets,
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "pptPhoto", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
    //{ name: "documentBack", maxCount: 1 }, // Added documentBack as an optional field
  ]),
  //checkImageQualityMiddleware,
  checkKycExists,
  checkExistingModeration,
  KycController.uploadKycAssets
);

// Update KYC status (For Admins)
router.put("/:id/status", adminAuth, KycController.updateKycStatus);

//Delete the KYC entry and its assets (For Admins)
router.delete("/:id", adminAuth, KycController.deleteKycEntry);

module.exports = router;
