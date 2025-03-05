const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // For image conversion

// Use multer's memoryStorage to store files in memory as buffers
const storage = multer.memoryStorage();

// Set file filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg", // JPEG
    "image/png", // PNG
    "image/jpg", // JPG
    "image/webp", // WebP
    "image/heic", // HEIC
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type, only JPEG, JPG, PNG, WebP, and HEIC are allowed!"
      ),
      false
    );
  }
};

// Create the multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 100 }, // Limit file size to 100MB
});

// A utility to save files and convert .jpg to .jpeg if necessary
const saveFileFromBuffer = async (buffer, filePath, mimetype) => {
  if (mimetype === "image/jpg") {
    const jpegFilePath = filePath.replace(/\.jpg$/, ".jpeg"); // Convert .jpg to .jpeg
    await sharp(buffer).toFormat("jpeg").toFile(jpegFilePath);
    return jpegFilePath; // Return the new path
  } else {
    // For other image formats, just save the file as it is
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(filePath);
      });
    });
  }
};

// A utility to ensure directory existence and file saving
// const saveKycAssets = async (req) => {
//   const kycId = req.params.kycId;

//   // Define the folder path
//   const folderPath = path.join(__dirname, "../public/kycAssets", kycId);

//   // Create the folder if it doesn't exist
//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath, { recursive: true });
//   }

//   // Define the relative file paths for both selfie and document
//   let selfieRelativePath = `/public/kycAssets/${kycId}/selfie-${kycId}.${
//     req.files.selfie[0].mimetype.split("/")[1]
//   }`;
//   let documentRelativePath = `/public/kycAssets/${kycId}/doc-${kycId}.${
//     req.files.document[0].mimetype.split("/")[1]
//   }`;

//   // Define the absolute file paths for both selfie and document
//   let selfieAbsolutePath = path.join(__dirname, `..${selfieRelativePath}`);
//   let documentAbsolutePath = path.join(__dirname, `..${documentRelativePath}`);

//   // Save the files from buffers to disk (convert .jpg to .jpeg if necessary)
//   selfieAbsolutePath = await saveFileFromBuffer(
//     req.files.selfie[0].buffer,
//     selfieAbsolutePath,
//     req.files.selfie[0].mimetype
//   );
//   documentAbsolutePath = await saveFileFromBuffer(
//     req.files.document[0].buffer,
//     documentAbsolutePath,
//     req.files.document[0].mimetype
//   );

//   // Update relative paths if conversion occurred
//   if (selfieAbsolutePath !== selfieRelativePath) {
//     selfieRelativePath = `/public/kycAssets/${kycId}/${path.basename(
//       selfieAbsolutePath
//     )}`;
//   }
//   if (documentAbsolutePath !== documentRelativePath) {
//     documentRelativePath = `/public/kycAssets/${kycId}/${path.basename(
//       documentAbsolutePath
//     )}`;
//   }

//   return {
//     selfie: {
//       relativePath: selfieRelativePath,
//       absolutePath: selfieAbsolutePath,
//     },
//     document: {
//       relativePath: documentRelativePath,
//       absolutePath: documentAbsolutePath,
//     },
//   };
// };

const saveKycAssets = async (req) => {
  const kycId = req.params.kycId;

  // Define the folder path
  const folderPath = path.join(__dirname, "../public/kycAssets", kycId);

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Define the relative file paths for selfie, document, aadhaar, and pptPhoto
  let selfieRelativePath = `/public/kycAssets/${kycId}/selfie-${kycId}.${
    req.files.selfie[0].mimetype.split("/")[1]
  }`;
  let documentRelativePath = `/public/kycAssets/${kycId}/doc-${kycId}.${
    req.files.document[0].mimetype.split("/")[1]
  }`;
  let aadhaarRelativePath = `/public/kycAssets/${kycId}/aadhaar-${kycId}.${
    req.files.aadhaarImage[0].mimetype.split("/")[1]
  }`;
  let pptPhotoRelativePath = `/public/kycAssets/${kycId}/pptPhoto-${kycId}.${
    req.files.pptPhoto[0].mimetype.split("/")[1]
  }`;

  // Define the absolute file paths for selfie, document, aadhaar, and pptPhoto
  let selfieAbsolutePath = path.join(__dirname, `..${selfieRelativePath}`);
  let documentAbsolutePath = path.join(__dirname, `..${documentRelativePath}`);
  let aadhaarAbsolutePath = path.join(__dirname, `..${aadhaarRelativePath}`);
  let pptPhotoAbsolutePath = path.join(__dirname, `..${pptPhotoRelativePath}`);

  // Save the files from buffers to disk
  selfieAbsolutePath = await saveFileFromBuffer(
    req.files.selfie[0].buffer,
    selfieAbsolutePath,
    req.files.selfie[0].mimetype
  );
  documentAbsolutePath = await saveFileFromBuffer(
    req.files.document[0].buffer,
    documentAbsolutePath,
    req.files.document[0].mimetype
  );
  aadhaarAbsolutePath = await saveFileFromBuffer(
    req.files.aadhaarImage[0].buffer,
    aadhaarAbsolutePath,
    req.files.aadhaarImage[0].mimetype
  );
  pptPhotoAbsolutePath = await saveFileFromBuffer(
    req.files.pptPhoto[0].buffer,
    pptPhotoAbsolutePath,
    req.files.pptPhoto[0].mimetype
  );

  return {
    selfie: {
      relativePath: `/public/kycAssets/${kycId}/${path.basename(
        selfieAbsolutePath
      )}`,
      absolutePath: selfieAbsolutePath,
    },
    document: {
      relativePath: `/public/kycAssets/${kycId}/${path.basename(
        documentAbsolutePath
      )}`,
      absolutePath: documentAbsolutePath,
    },
    aadhaar: {
      relativePath: `/public/kycAssets/${kycId}/${path.basename(
        aadhaarAbsolutePath
      )}`,
      absolutePath: aadhaarAbsolutePath,
    },
    pptPhoto: {
      relativePath: `/public/kycAssets/${kycId}/${path.basename(
        pptPhotoAbsolutePath
      )}`,
      absolutePath: pptPhotoAbsolutePath,
    },
  };
};

// A utility to delete KYC assets
const deleteAssets = async (kycId) => {
  const folderPath = path.join(__dirname, "../public/kycAssets", kycId);

  return new Promise((resolve, reject) => {
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        return reject(new Error("Error deleting KYC assets: " + err.message));
      }
      resolve({ message: "KYC assets deleted successfully" });
    });
  });
};

module.exports = { upload, saveKycAssets, deleteAssets };
