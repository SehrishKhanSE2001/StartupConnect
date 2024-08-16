const { default: mongoose } = require('mongoose');
const investor=require('../models/Investor')


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
]);

const getAllInvestors = async(req,res) => {
    try{
        const investor1 = await investor.find();
        res.status(200).json(investor1)
    }catch(error)
    {
       res.status(500).json({message:'Error in getting the investors',error})
    }
}
const getInvestorById = async(req,res) => {
    try{
      const {id} = req.params;
      const foundInvestor = await investor.findById(id);
      if(!foundInvestor)
      {
       res.status(404).json({message:'Error finding the specififc id investor',error})
      }
       res.status(200).json({message:'Investor of specififc id: ',foundInvestor})
    }catch(error)
    {
        res.status(500).json({message:'Error in getting investor of specific id',error})
    }
}
// const addInvestor= async(req,res)=>{
//   try{
//      const newInvestor= new investor(req.body);
//      const savedInvestor=await newInvestor.save();
//      res.status(201).json(savedInvestor);
//   }catch(error)
//   {
//    res.status(500).json({message:'Error adding investor', error});
//   }
// };

const addInvestor = async (req, res) => {
  try {
    // Log request body and files for debugging
    console.log('Request Body:', req.body);
    console.log('Files:', req.files);

    // Create a new investor with the request body
    const newInvestor = new investor(req.body);

    // Check if logo file is present
    const logo = req.files && req.files['logo'] ? req.files['logo'][0].path : null;

    // If a logo is present, update the investor's logo field
    if (logo) {
      newInvestor.logo = logo;
    }

    // Save the new investor
    const savedInvestor = await newInvestor.save();
    res.status(201).json(savedInvestor);
  } catch (error) {
    console.error('Error adding investor:', error);
    res.status(500).json({ message: 'Error adding investor', error: error.message });
  }
};


const getInvestorByUserId = async(req,res) => {
    try{
       const {userId} = req.params;
       console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"+userId)
       if(!mongoose.Types.ObjectId.isValid(userId))
       {
        return res.status(400).json({message:'userId is in valid'});
       }
       const Investor= await investor.findOne({user:userId});
       if(!Investor)
       {
          return res.status(404).jsob({message:'Investor of specififc userId cannot be found'})
       }
       res.status(200).json({Investor})
    }catch(error)
    {
       res.status(500).json({message:'error in finding the user',error})
    }
}
const deleteInvestor= async(req,res)=>{
    try{
      const {id} = req.params;
      const deleteInvestor = await investor.findByIdAndDelete(id);
      if(!deleteInvestor)
      {
        return res.status(404).json({message:'Investor not found'});
      }
       res.status(200).json({message:'Investor deleted successfully!'})
    }catch(error)
    {
      res.status(500).json({message:'Error deleting the investor',error})
    }
};

// const updateInvestor = async(req,res) => {
//     try{
//       const {id}=req.params;
//       const updateData =req.body;
//       const updatedInvestor = await investor.findByIdAndUpdate(id,updateData,{new:true});
//       if(!updatedInvestor)
//       {
//         return res.status(404).json({message:'Investor not found'});
//       }
//       res.status(200).json({message: 'Investor updated successfully!',updatedInvestor})
//     }catch(error)
//     {
//       res.status(500).json({message:'Error updating the investor',error:error.message});
//     }
// }

const updateInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if logo file is present in the request
    const logo = req.files && req.files['logo'] ? req.files['logo'][0].path : null;

    // If a logo is present, include it in the updateData
    if (logo) {
      updateData.logo = logo;
    }

    // Update the investor in the database
    const updatedInvestor = await investor.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedInvestor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    res.status(200).json({ message: 'Investor updated successfully!', updatedInvestor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating the investor', error: error.message });
  }
};


module.exports={
    getAllInvestors,
    getInvestorById,
    getInvestorByUserId,
    addInvestor,
    deleteInvestor,
    updateInvestor,
    uploadFields
}