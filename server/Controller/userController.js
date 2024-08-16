const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { default: mongoose } = require("mongoose");

//THIS LOGIN IS ALSO CORRECT------------------------------------------------------
let login = (req, res) => {
    let { email, password } = req.body;
  
    userModel.findOne({ email: email }).then(async foundUser => {
      if (!foundUser) {
        res.status(404).send({ "Message": "User Not Found" });
      } else {
        const isMatch = await bcrypt.compare(password, foundUser.password);
  
        if (isMatch) {
          let token = jwt.sign({
            id: foundUser._id,
            role: foundUser.role,
          }, process.env.SECRET_KEY, {
            expiresIn: '24h'
          });
          res.status(200).send({ foundUser, token });
        } else {
          res.status(403).send({ "Message": "Invalid Password" });
        }
      }
    });
  };
  
// THIS IS ALSO CORRECT------------------------------------------------------


let signup = async (req, res) => {
  let { name, email, password, location, phonenumber } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);

      let user = new userModel({
          name,
          email,
          password: hashedPassword,
          location,
          Date: Date.now(),
          Description:'',
          phonenumber,
          Description:'', // Set description to an empty string
    
      });

      user.save()
          .then((user) => {
              res.status(200).json({ "Message": "User Created", user: user });
          })
          .catch(err => {
              console.error("Error saving user:", err); // Print the error to the console
              res.status(500).json({ "Message": "User Not Created", err: err });
          });

  } catch (error) {
      console.error("Error hashing password:", error); // Print the error to the console
      res.status(500).json({ "Message": "Error hashing password", error: error });
  }
};

const getSpecificUser = async (req, res) => {
  let { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid User Id' });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User cannot be found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error); // Print the error to the console
    res.status(500).json({ message: 'Error fetching user', error: error });
  }
};


module.exports = {
    signup,
    login,
    getSpecificUser,
}


