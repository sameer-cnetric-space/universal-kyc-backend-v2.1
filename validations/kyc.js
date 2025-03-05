const Joi = require("joi");

// Validation schema for KYC submission
const kycSchema = Joi.object({
  nationality: Joi.string().required().label("Nationality"),
  dob: Joi.date().required().label("Date of Birth"),
  idType: Joi.string()
    .valid("aadhaar-card", "passport", "dl", "voter-id", "pan-card")
    .required()
    .label("ID Type"),
  idNumber: Joi.string().required().label("ID Number"),
  idIssueDate: Joi.date().required().label("ID Issue Date"),
  idExpiryDate: Joi.date().optional().label("ID Expiry Date"), // Optional because some IDs may not have an expiry date
  idIssuingCountry: Joi.string().required().label("ID Issuing Country"),
  countryOfResidence: Joi.string().required().label("Country of Residence"),
  addressLine1: Joi.string().required().label("Address Line 1"),
  addressLine2: Joi.string().optional().allow(""), // Optional and can be an empty string
  city: Joi.string().required().label("City"),
  state: Joi.string().required().label("State"),
  zipCode: Joi.string().required().label("Zip Code"),
});

const validateAadhaar = Joi.object({
  aadhaarNumber: Joi.string()
    .trim() // Remove leading/trailing spaces
    .length(12) // Aadhaar number must be exactly 12 digits
    .pattern(/^[0-9]{12}$/) // Ensures only digits (no letters or special chars)
    .required()
    .messages({
      "string.empty": "Aadhaar Number is required",
      "string.length": "Aadhaar Number must be exactly 12 digits",
      "string.pattern.base": "Aadhaar Number must contain only numeric digits",
    }),
});

const validateAadhaarOtp = Joi.object({
  otp: Joi.string().required().label("OTP"),
  key: Joi.string().required().label("Key"),
});

// Export the schema
module.exports = { kycSchema, validateAadhaar, validateAadhaarOtp };
