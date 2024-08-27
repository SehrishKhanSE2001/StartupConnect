const userModel = require("../models/User");
const investorModel = require("../models/Investor");
const startupModel = require("../models/Startup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

// const defaultAdmin = {
//   email:'amina@hotmail.com',
//   password:'Aminapassword123@#$5677',  //aminapassword123@#$567
//   role:'admin'
// }

let adminLogin = async (req, res) => {
  const { email, password } = req.body;
  

  try {
    // Find the admin by email
    const foundAdmin = await userModel.findOne({ email: email, role: "admin" });
    if (!foundAdmin) {
      return res.status(404).send({ Message: "Admin Not Found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, foundAdmin.password);

    if (isMatch) {
      // Generate a JWT token
      const token = jwt.sign(
        {
          id: foundAdmin._id,
          role: foundAdmin.role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).send({ foundAdmin, token });
    } else {
      res.status(403).send({ Message: "Invalid Password" });
    }
  } catch (error) {
    console.error("Error logging in admin:", error);
    res
      .status(500)
      .send({ Message: "Admin login failed. Error: " + error.message });
  }
};

//THIS LOGIN IS ALSO CORRECT------------------------------------------------------
let login = (req, res) => {
  let { email, password } = req.body;

  console.log("#######3" + password);

  userModel.findOne({ email: email }).then(async (foundUser) => {
    if (!foundUser) {
      res.status(404).send({ Message: "User Not Found" });
    } else {
      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (isMatch) {
        let token = jwt.sign(
          {
            id: foundUser._id,
            role: foundUser.role,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );
        res.status(200).send({ foundUser, token });
      } else {
        res.status(403).send({ Message: "Invalid Password" });
      }
    }
  });
};

// THIS IS ALSO CORRECT------------------------------------------------------

const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) return false;
  if (!hasUppercase.test(password)) return false;
  if (!hasLowercase.test(password)) return false;
  if (!hasSpecialChar.test(password)) return false;

  return true;
};

let signup = async (req, res) => {
  let { name, email, password, location, phonenumber } = req.body;

  try {
    const users = await userModel.find();
    console.log("Fetched users from database:", users);

    // Check if the provided password matches any of the existing hashed passwords
    const passwordExists = await Promise.all(
      users.map(async (user) => {
        const match = await bcrypt.compare(password, user.password);
        console.log(`Comparing password with user ${user.email}: ${match}`);
        return match;
      })
    );

    console.log("Password existence check results:", passwordExists);

    if (passwordExists.includes(true)) {
      return res
        .status(400)
        .json({ message: "The password you entered already exists" });
    }

    // Validate password length and complexity
    if (!validatePassword(password)) {
      console.log("Password validation failed");
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters long and contain uppercase, lowercase, and special characters.",
        });
    }
    //-------
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new userModel({
      name,
      email,
      password: hashedPassword,
      location,
      Date: Date.now(),
      Description: "",
      phonenumber,
      Description: "", // Set description to an empty string
      role: "user", // added by myself
    });

    user
      .save()
      .then((user) => {
        res.status(200).json({ Message: "User Created", user: user });
      })
      .catch((err) => {
        console.error("Error saving user:", err); // Print the error to the console
        res.status(500).json({ Message: "User Not Created", err: err });
      });
  } catch (error) {
    console.error("Error hashing password:", error); // Print the error to the console
    res.status(500).json({ Message: "Error hashing password", error: error });
  }
};

const updateSignupInfo = async (req, res) => {
  try {
    const { id } = req.params; // Extract `id` from params
    const updates = req.body;
    const { password } = req.body; // Extract password from body

    // Validate password length and complexity
    if (password && !validatePassword(password)) {
      console.log("Password validation failed");
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain uppercase, lowercase, and special characters.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User Id" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    updates.password = hashedPassword;

    const updatedUser = await userModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); // Improved logging
    res
      .status(500)
      .json({ message: "User not updated. Error: " + error.message });
  }
};

const getSpecificUser = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User Id" });
  }

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User cannot be found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error); // Print the error to the console
    res.status(500).json({ message: "Error fetching user", error: error });
  }
};

const checkInvestorIdCorrespondingToUser = async (req, res) => {
  const { id } = req.params;

  // Check if the provided user ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "User cannot be found, invalid userId" });
  }

  try {
    // Find the user by the provided ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User cannot be found" });
    }

    let investor = null;
    let investorId = null;

    // Check if the user has a valid investorId and fetch the investor
    if (user.investorId && mongoose.Types.ObjectId.isValid(user.investorId)) {
      investor = await investorModel.findById(user.investorId);
      investorId = investor ? investor._id : null;
    } else {
      // If not, find the investor associated with the user
      investor = await investorModel.findOne({ user: user._id });
      investorId = investor ? investor._id : null;
    }

    // Return the results
    res.status(200).json({
      hasInvestor: !!investor,
      investorId: investorId,
      investorDetails: investor || null,
    });
  } catch (error) {
    console.error("Error checking user investor association:", error);
    res
      .status(500)
      .json({
        message: "Error checking user investor association",
        error: error.message,
      });
  }
};
let getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error); // Print the error to the console
    res.status(500).json({ message: "Error fetching users", error: error });
  }
};

const getAdmin = async (req, res) => {
  try {
    // Find the admin in the database
    const admin = await userModel
      .findOne({ role: "admin" })
      .select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res
      .status(500)
      .json({ message: "Error fetching admin details", error: error.message });
  }
};

const adminUpdate = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { id } = req.params; // Admin ID
    const { password, ...updates } = req.body;

    // Validate password length and complexity if password is provided
    if (password && !validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain uppercase, lowercase, and special characters.",
      });
    }

    // Hash the new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    // Update the admin in the database
    const updatedAdmin = await userModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Respond with the updated admin details
    res
      .status(200)
      .json({ message: "Admin updated successfully!", admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating admin:", error);
    res
      .status(500)
      .json({ message: "Admin not updated. Error: " + error.message });
  }
};

module.exports = {
  signup,
  login,
  updateSignupInfo,
  getSpecificUser,
  checkInvestorIdCorrespondingToUser,
  getAllUsers,
  adminLogin,
  adminUpdate,
  getAdmin,
};
