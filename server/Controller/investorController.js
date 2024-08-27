const { default: mongoose } = require("mongoose");
const investor = require("../models/Investor");

// const multer = require("multer");
// const path = require("path");

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Ensure 'uploads/' directory exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// const uploadFields = upload.fields([{ name: "logo", maxCount: 1 }]);

// //cloudinary code
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Replace with your cloud name if hardcoding
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// console.log("Cloudinary Configuration:", {
//   cloud_name: cloudinary.config().cloud_name,
//   api_key: cloudinary.config().api_key,
//   api_secret: cloudinary.config().api_secret,
// });

const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const { Readable } = require('stream');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file uploads with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([{ name: "logo", maxCount: 1 }]);

const addInvestor = async (req, res) => {
  try {
    const newInvestor = new investor(req.body);

    if (req.files && req.files["logo"]) { 
      const file = req.files["logo"][0];
      
      // Log file informationn
      console.log("File details:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      if (!file || !file.buffer) {
        throw new Error("File buffer is missing");
      }

      const fileStream = Readable.from(file.buffer);

      // Upload the file directly to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });

        fileStream.pipe(uploadStream);
      });

      if (uploadResponse.error) {
        throw new Error(uploadResponse.error.message);
      }

      newInvestor.logo = uploadResponse.secure_url;
    }

    const savedInvestor = await newInvestor.save();
    res.status(201).json(savedInvestor);
  } catch (error) {
    console.error("Error adding investor:", error);
    res.status(500).json({ message: "Error adding investor", error: error.message });
  }
};

const getAllInvestors = async (req, res) => {
  try {
    const investor1 = await investor.find();
    res.status(200).json(investor1);
  } catch (error) {
    res.status(500).json({ message: "Error in getting the investors", error });
  }
};
const getInvestorById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundInvestor = await investor.findById(id);
    if (!foundInvestor) {
      res
        .status(404)
        .json({ message: "Error finding the specififc id investor", error });
    }
    res
      .status(200)
      .json({ message: "Investor of specififc id: ", foundInvestor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in getting investor of specific id", error });
  }
};

// const addInvestor = async (req, res) => {
//   try {
//     // Create a new investor with the request body
//     const newInvestor = new investor(req.body);

//     // Check if logo file is present
//     const logo =
//       req.files && req.files["logo"] ? req.files["logo"][0].path : null;

//     // If a logo is present, update the investor's logo field
//     if (logo) {
//       newInvestor.logo = logo;
//     }

//     // Save the new investor
//     const savedInvestor = await newInvestor.save();
//     res.status(201).json(savedInvestor);
//   } catch (error) {
//     console.error("Error adding investor:", error);
//     res
//       .status(500)
//       .json({ message: "Error adding investor", error: error.message });
//   }
// };






const getInvestorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId is in valid" });
    }
    const Investor = await investor.findOne({ user: userId });
    if (!Investor) {
      return res
        .status(404)
        .jsob({ message: "Investor of specififc userId cannot be found" });
    }
    res.status(200).json({ Investor });
  } catch (error) {
    res.status(500).json({ message: "error in finding the user", error });
  }
};
const deleteInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteInvestor = await investor.findByIdAndDelete(id);
    if (!deleteInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }
    res.status(200).json({ message: "Investor deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the investor", error });
  }
};

// const updateInvestor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Check if logo file is present in the request
//     const logo =
//       req.files && req.files["logo"] ? req.files["logo"][0].path : null;

//     // If a logo is present, include it in the updateData
//     if (logo) {
//       updateData.logo = logo;
//     }

//     // Ensure userId is a single value (if applicable)
//     if (Array.isArray(updateData.user)) {
//       updateData.user = updateData.user[0]; // Adjust based on your logic
//     }

//     // Update the investor in the database
//     const updatedInvestor = await investor.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedInvestor) {
//       return res.status(404).json({ message: "Investor not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Investor updated successfully!", updatedInvestor });
//   } catch (error) {
//     console.error("Error updating investor:", error);
//     res
//       .status(500)
//       .json({ message: "Error updating the investor", error: error.message });
//   }
// };

const updateInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.files && req.files["logo"]) {
      const file = req.files["logo"][0];

      // Log file details
      console.log("File details:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      if (!file || !file.buffer) {
        throw new Error("File buffer is missing");
      }

      // Upload the file directly to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });

        // Pipe file buffer to Cloudinary
        uploadStream.end(file.buffer);
      });

      if (uploadResponse.error) {
        throw new Error(uploadResponse.error.message);
      }

      updateData.logo = uploadResponse.secure_url;
    }

    const updatedInvestor = await investor.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({ message: "Investor updated successfully!", updatedInvestor });
  } catch (error) {
    console.error("Error updating investor:", error);
    res.status(500).json({ message: "Error updating the investor", error: error.message });
  }
};



const updateInvestorByUserId = async (userId, updateData) => {
  try {
    // Find the investor by userId and update it with the new data
    const updatedInvestor = await investor.findOneAndUpdate(
      { user: userId }, // Filter to find the investor by userId
      updateData, // Data to update
      { new: true } // Return the updated document
    );

    if (!updatedInvestor) {
      throw new Error("Investor not found");
    }

    return updatedInvestor;
  } catch (error) {
    console.error("Error updating the investor: ", error);
    throw error;
  }
};

module.exports = {
  getAllInvestors,
  getInvestorById,
  getInvestorByUserId,
  addInvestor,
  deleteInvestor,
  updateInvestor,
  uploadFields,
  updateInvestorByUserId,
};
