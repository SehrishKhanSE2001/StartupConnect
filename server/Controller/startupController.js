// const mongoose = require('mongoose');
// const Startup = require('../models/Startup'); // Adjust the path as needed
// const path=require('path')
// let multer=require("multer");
// const { getDefaultAutoSelectFamily } = require('net');

// // storage and file name setting
// let storage=multer.diskStorage({
//    destination:(req, file, cb)=>{
//     cb(null,'./uploads')
//    },
//    filename:(req,file,cb)=>{
//       console.log(file);
//       cb(null, Date.now()+ path.extname(file.originalname))
//    }
// })

// const upload = multer({storage: storage})

// const uploadFields = upload.fields([  // This is the middleware for upload
//     { name: 'logo', maxCount: 1 },
//     { name: 'teamImage', maxCount: 1 }
// ]);



// const getAllStartups =async (req,res)=>{
//  try{
//    const startups = await Startup.find();
//    res.status(200).json(startups);
//  }catch(error)
//  {
//    console.error(error)
//    res.status(500).json({message: 'internal server error'})
//  }
// }


// const getStartupByUserId = async (req, res) => {
//     try {
//       const { userId } = req.params;
//       if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: 'Invalid User Id' });
//       }
//       const startup = await Startup.findOne({ user: userId });
//       if (!startup) {
//         return res.status(404).json({ message: 'Startup cannot be found' });
//       }
//       res.status(200).json(startup);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };

// const registerStartup = async (req, res) => {
//     try {
//         const { name, founders, aim, overview, businessPlan, projections, product, user } = req.body;

//         const logo = req.files['logo'] ? req.files['logo'][0].path : null;
//         const teamImage = req.files['teamImage'] ? req.files['teamImage'][0].path : null;

//         const newStartup = new Startup({
//             name,
//             founders,
//             aim,
//             overview,
//             businessPlan,
//             projections,
//             product,
//             logo,
//             teamImage,
//             user: new mongoose.Types.ObjectId(user) // Correctly create a new ObjectId instance
//         });

//         await newStartup.save();

//         res.status(201).json({ message: 'Startup registered successfully', startup: newStartup });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };



// const updateStartup = async (req, res) => {
//     try {
//         const { id } = req.params; // Get the startup ID from the route parameters
//         const updates = req.body; // Get the updates from the request body
        
//         // Validate ID
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: 'Invalid startup ID' });
//         }

//         // Decode logo and teamImage if they exist in the updates
//         if (updates.logo) {
//             const decodedLogo = decodeBase64Image(updates.logo);
//             if (decodedLogo instanceof Error) {
//                 return res.status(400).json({ message: 'Invalid logo format' });
//             }
//             updates.logo = decodedLogo.data;
//         }
        
//         if (updates.teamImage) {
//             const decodedTeamImage = decodeBase64Image(updates.teamImage);
//             if (decodedTeamImage instanceof Error) {
//                 return res.status(400).json({ message: 'Invalid teamImage format' });
//             }
//             updates.teamImage = decodedTeamImage.data;
//         }

//         const updatedStartup = await Startup.findByIdAndUpdate(id, updates, { new: true });

//         if (!updatedStartup) {
//             return res.status(404).json({ message: 'Startup not found' });
//         }

//         res.status(200).json({ message: 'Startup updated successfully', startup: updatedStartup });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// module.exports = {
//     getAllStartups,
//     getStartupByUserId,
//     registerStartup,
//     updateStartup,
//     uploadFields
// };

const mongoose = require('mongoose');
const Startup = require('../models/Startup'); // Adjust the path as needed
const path = require('path');
const multer = require('multer');

//Storage and file name setting
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  //.uploads
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});



const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'teamImage', maxCount: 1 }
]);

const getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find();
    res.status(200).json(startups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getStartupByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User Id' });
    }
    const startup = await Startup.findOne({ user: userId });
    if (!startup) {
      return res.status(404).json({ message: 'Startup cannot be found' });
    }
    res.status(200).json(startup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStartupId = async (req, res) => {
  try {
    const { startupId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(startupId)) {
      return res.status(400).json({ message: 'Invalid StartupId' });
    }

    // Fetch the startup by its ObjectId
    const startup = await Startup.findById(startupId); // Adjust field name if necessary

    if (!startup) {
      return res.status(404).json({ message: 'Startup cannot be found' });
    }

    res.status(200).json(startup);
  } catch (error) {
    console.error(error); // Use console.error for error logging
    res.status(500).json({ message: 'Internal server error' });
  }
}




// const registerStartup = async (req, res) => {
//   try {
//     const { name, founders, aim, overview, businessPlan, projections, product , user } = req.body;
    

//      // Parse products from the req.body
//      console.log(projections)
//      console.log(product);
    
//     const logo = req.files['logo'] ? req.files['logo'][0].path : null;
//     const teamImage = req.files['teamImage'] ? req.files['teamImage'][0].path : null;

//     const newStartup = new Startup({
//       name,
//       founders,
//       aim,
//       overview,
//       businessPlan,
//       projections,
//       product,
//       logo,
//       teamImage,
//       user: new mongoose.Types.ObjectId(user) // Correctly create a new ObjectId instance
//     });

//     await newStartup.save();

//     res.status(201).json({ message: 'Startup registered successfully', startup: newStartup });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// const registerStartup = async (req, res) => {
//     try {
//       const { name, founders, aim, overview, businessPlan, projections, product, user } = req.body;
      
//       const newStartup = new Startup({
//         name,
//         founders,
//         aim,
//         overview,
//         businessPlan,
//         projections,
//         product,
//         user: new mongoose.Types.ObjectId(user) // Correctly create a new ObjectId instance
//       });
  
//       await newStartup.save();
  
//       res.status(201).json({ message: 'Startup registered successfully', startup: newStartup });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };

const registerStartup = async (req, res) => {
  try {
      const { name, founders, aim, overview, businessPlan, projections, product, user } = req.body;

      const newStartup = new Startup({
          name,
          founders,
          aim,
          overview,
          businessPlan,
          projections,
          product,
          user: new mongoose.Types.ObjectId(user) // Correctly create a new ObjectId instance
      });

      await newStartup.save();

      res.status(201).json({ 
          message: 'Startup registered successfully', 
          startupId: newStartup._id // Return the startup's _id
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

  

// const updateStartup = async (req, res) => {
//   try {
//     const { id } = req.params; // Get the startup ID from the route parameters
//     const updates = req.body; // Get the updates from the request body

//     // Validate ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid startup ID' });
//     }

//     const updatedStartup = await Startup.findByIdAndUpdate(id, updates, { new: true });

//     if (!updatedStartup) {
//       return res.status(404).json({ message: 'Startup not found' });
//     }

//     res.status(200).json({ message: 'Startup updated successfully', startup: updatedStartup });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
const updateStartup = async (req, res) => {
  try {
    const { id } = req.params; // Get the startup ID from the route parameters
    const updates = req.body; // Get the updates from the request body
    
    // added by myself
    //updates.logo = req.files['logo'] ? req.files['logo'][0].path : null;
    //updates.teamImage = req.files['teamImage'] ? req.files['teamImage'][0].path : null;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid startup ID' });
    }

    // Optionally, validate and sanitize updates
    // Example: const validUpdates = sanitizeUpdates(updates);

    const updatedStartup = await Startup.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedStartup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.status(200).json({ message: 'Startup updated successfully', startup: updatedStartup });
  } catch (error) {
    console.error('Error updating startup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateStartupImageId = async (req, res) => {
  try {
    const { id } = req.params;
    const logo = req.files['logo'] ? req.files['logo'][0].path : null;
    const teamImage = req.files['teamImage'] ? req.files['teamImage'][0].path : null;

    const updateFields = {};
    if (logo) updateFields.logo = logo;
    if (teamImage) updateFields.teamImage = teamImage;

    const updatedStartup = await Startup.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedStartup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.status(200).json({ message: 'Startup updated successfully', startup: updatedStartup });

  } catch (error) {
    console.error('Error updating startup: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteStartup = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid startup ID' });
    }

    const deletedStartup = await Startup.findByIdAndDelete(id);
    if (!deletedStartup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.status(200).json({ message: 'Startup deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { startupId, productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(startupId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid IDs' });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    startup.product = startup.product.filter(p => p._id.toString() !== productId);
    await startup.save();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { startupId, productId, teamMemberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(startupId) || !mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(teamMemberId)) {
      return res.status(400).json({ message: 'Invalid IDs' });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const product = startup.product.id(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.teammembers = product.teammembers.filter(tm => tm._id.toString() !== teamMemberId);
    await startup.save();

    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { id } = req.params; // Extract `id` from the route parameters
    const { investorId, userId, description, starRating } = req.body;

    if (!investorId || !userId || !description || !starRating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const feedback = {
      investorId,
      userId,
      description,
      starRating
    };

    const startup = await Startup.findById(id); // Find startup by `id`

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    startup.feedback.push(feedback);
    await startup.save();

    res.status(201).json({ message: 'Feedback added successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { id } = req.params; // Extract `id` from the route parameters

    const startup = await Startup.findById(id).populate('feedback.investorId').populate('feedback.userId');

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.status(200).json(startup.feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};




module.exports = {
  getAllStartups,
  getStartupByUserId,
  registerStartup,
  updateStartup,
  uploadFields,
 deleteStartup,
 deleteProduct,
 deleteTeamMember,
 updateStartupImageId,
 getStartupId,
 addFeedback,
 getFeedback
};





